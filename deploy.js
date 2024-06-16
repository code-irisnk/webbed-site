// This file is not to be run directly, but rather as a part of the deployment process.
// Please do not run it manually, let Cloudflare Pages handle it.
const {
    execSync
} = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');
// Get the current commit SHA
const commitSha = execSync('git rev-parse --short HEAD').toString().trim();
console.log(`Current commit SHA: ${commitSha}`);
// Write commit SHA to file
fs.writeFile('commit-sha', commitSha, 'utf8').then(() => console.log('Commit SHA written to file')).catch(error => console.error(`Error writing commit SHA to file: ${error.message}`));
async function processFile(file) {
    try {
        const filePath = path.join('.', file);
        let htmlContent = await fs.readFile(filePath, 'utf8');
        if (htmlContent.includes('{{commitSha}}')) {
            const template = Handlebars.compile(htmlContent);
            const result = template({
                commitSha
            });
            await fs.writeFile(filePath, result, 'utf8');
            console.log(`Updated ${filePath} with commit SHA: ${commitSha}`);
        } else {
            console.log(`No commit SHA template found in ${filePath}, skipping.`);
        }
    } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
    }
}
fs.readdir('.').then(files => {
    // Filter to only process HTML files
    const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');
    if (htmlFiles.length === 0) {
        console.log('No HTML files to process.');
        return;
    }
    return Promise.all(htmlFiles.map(processFile));
}).then(() => console.log('All files processed')).catch(error => console.error(`Error reading directory: ${error.message}`));