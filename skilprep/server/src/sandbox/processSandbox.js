const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const languages = require('./languages');

async function runProcess(command, args, options = {}) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: process.platform === 'win32',
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let finished = false;

    const timeout = setTimeout(() => {
      if (finished) return;
      finished = true;
      child.kill();
      resolve({
        stdout,
        stderr: stderr || 'Time limit exceeded',
        exitCode: null,
        timedOut: true,
        executionTimeMs: Date.now() - startedAt,
      });
    }, options.timeoutMs || 5000);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (exitCode) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      resolve({
        stdout,
        stderr,
        exitCode,
        timedOut: false,
        executionTimeMs: Date.now() - startedAt,
      });
    });

    if (options.input) {
      child.stdin.write(options.input);
    }
    child.stdin.end();
  });
}

async function executeCode({ language, code, input = '', timeoutMs = 5000 }) {
  const config = languages[language];
  if (!config) {
    return { stdout: '', stderr: `Unsupported language: ${language}`, compileError: true, exitCode: null, timedOut: false, executionTimeMs: 0 };
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'skilprep-'));
  const sourcePath = path.join(tempDir, config.fileName);
  await fs.writeFile(sourcePath, code, 'utf8');

  try {
    if (config.compileCommand) {
      const compileResult = await runProcess(config.compileCommand, config.compileArgs, { cwd: tempDir, timeoutMs: timeoutMs * 2 });
      if (compileResult.exitCode !== 0 || compileResult.timedOut) {
        return {
          ...compileResult,
          compileError: true,
          stdout: '',
          stderr: compileResult.stderr || 'Compilation failed',
        };
      }
    }

    const runResult = await runProcess(config.runCommand, config.runArgs, { cwd: tempDir, timeoutMs, input });
    return {
      ...runResult,
      compileError: false,
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

module.exports = { executeCode };