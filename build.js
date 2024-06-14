const { execSync } = require('child_process');
const commitSha = execSync('git rev-parse --short HEAD').toString().trim();

// Set the environment variable
process.env.COMMIT_SHA = commitSha;

// Other build steps...
