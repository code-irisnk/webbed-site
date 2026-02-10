import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';

// Get the current commit SHAs
const commitShaShort: string = execSync('git rev-parse --short HEAD').toString().trim();
const commitShaFull: string = execSync('git rev-parse HEAD').toString().trim();

console.log(`Current commit short SHA: ${commitShaShort}`);
console.log(`Current commit full SHA: ${commitShaFull}`);

// Path to the environment files
const envPaths: string[] = [
  path.join(__dirname, 'src/environments/environment.ts'),
  path.join(__dirname, 'src/environments/environment.prod.ts'),
];

async function updateEnvironmentFiles(): Promise<void> {
  for (const envPath of envPaths) {
    try {
      let envContent: string = await fs.readFile(envPath, 'utf8');

      // Update or insert commitSha
      envContent = envContent.replace(/commitSha:\s*'.*'/, `commitSha: '${commitShaShort}'`);

      // If commitShaFull exists, replace it; otherwise, add it
      if (envContent.match(/commitShaFull:\s*'.*'/)) {
        envContent = envContent.replace(/commitShaFull:\s*'.*'/, `commitShaFull: '${commitShaFull}'`);
      } else {
        // Insert commitShaFull after commitSha line
        envContent = envContent.replace(
          /commitSha:\s*'.*'/,
          (match) => `${match},\n  commitShaFull: '${commitShaFull}'`,
        );
      }

      await fs.writeFile(envPath, envContent, 'utf8');
      console.log(`✅ Updated ${envPath} with commit SHAs.`);
    } catch (error) {
      console.error(`❌ Error updating ${envPath}: ${(error as Error).message}`);
    }
  }
}

// Run the update function
updateEnvironmentFiles().then((): void => console.log('🚀 Deployment script completed.'));
