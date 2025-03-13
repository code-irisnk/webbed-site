import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

// Get the current commit SHA
const commitSha: string = execSync('git rev-parse --short HEAD').toString().trim();
console.log(`Current commit SHA: ${commitSha}`);

// Path to the environment files
const envPaths : string[] = [
  path.join(__dirname, 'src/environments/environment.ts'),
  path.join(__dirname, 'src/environments/environment.prod.ts')
];

async function updateEnvironmentFiles():Promise<void> {
  for (const envPath of envPaths) {
    try {
      let envContent:string = await fs.readFile(envPath, 'utf8');
      const updatedContent:string = envContent.replace(/commitSha: '.*'/, `commitSha: '${commitSha}'`);
      await fs.writeFile(envPath, updatedContent, 'utf8');
      console.log(`Updated ${envPath} with commit SHA: ${commitSha}`);
    } catch (error) {
      console.error(`Error updating ${envPath}: ${(error as Error).message}`);
    }
  }
}

// Run the update function
updateEnvironmentFiles().then(():void => console.log('Deployment script completed.'));
