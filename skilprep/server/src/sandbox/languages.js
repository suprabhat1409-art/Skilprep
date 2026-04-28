module.exports = {
  python: {
    fileName: 'main.py',
    runCommand: 'python',
    runArgs: ['main.py'],
  },
  javascript: {
    fileName: 'main.js',
    runCommand: 'node',
    runArgs: ['main.js'],
  },
  cpp: {
    fileName: 'main.cpp',
    compileCommand: 'g++',
    compileArgs: ['-std=c++17', 'main.cpp', '-o', process.platform === 'win32' ? 'main.exe' : 'main'],
    runCommand: process.platform === 'win32' ? 'main.exe' : './main',
    runArgs: [],
  },
  java: {
    fileName: 'Main.java',
    compileCommand: 'javac',
    compileArgs: ['Main.java'],
    runCommand: 'java',
    runArgs: ['Main'],
  },
};