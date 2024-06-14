const { execSync } = require('child_process');
const fs = require('fs');

const commitSha = execSync('git rev-parse --short HEAD').toString().trim();
console.log(`Current commit SHA: ${commitSha}`);

fs.writeFileSync('commit-sha', JSON.stringify({ sha: commitSha }));
