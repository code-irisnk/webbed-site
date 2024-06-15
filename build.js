// This file is not to be ran directly, but rather as a part of the build process.
// Please do not run it manually, let Cloudflare Pages handle it.
const {
    execSync
} = require('child_process');
const fs = require('fs');
const path = require('path');
// Get the current commit SHA
const commitSha = execSync('git rev-parse --short HEAD').toString().trim();
console.log(`Current commit SHA: ${commitSha}`);
fs.writeFileSync('commit-sha', JSON.stringify({
    sha: commitSha
}));
const files = fs.readdirSync('.');
files.forEach(file => {
    try {
        const filePath = path.join('.', file);
        let htmlContent = fs.readFileSync(filePath, 'utf8');
        if (htmlContent.includes('<!--COMMIT_SHA-->')) {
            htmlContent = htmlContent.replace('<!--COMMIT_SHA-->', commitSha);
            fs.writeFileSync(filePath, htmlContent, 'utf8');
            console.log(`Updated ${filePath} with commit SHA: ${commitSha}`);
        } else {
            console.log(`No commit SHA template found in ${filePath}, skipping.`);
        }
    } catch (error) {
        console.error(`Error processing file ${file}: ${error.message}`);
    }
});