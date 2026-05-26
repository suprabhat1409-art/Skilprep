const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async function generate() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const htmlPath = path.join(projectRoot, 'docs', 'project-report.html');
    const pdfPath = path.join(projectRoot, 'docs', 'SkilPrep-project-report.pdf');

    if (!fs.existsSync(htmlPath)) {
      console.error('HTML report not found:', htmlPath);
      process.exit(2);
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '16mm', right: '16mm' } });
    await browser.close();
    console.log('PDF written to', pdfPath);
  } catch (err) {
    console.error('PDF generation failed:', err);
    process.exit(1);
  }
})();
