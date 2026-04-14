import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';

// better root anchor
const root = process.cwd();

const commitShaShort = execSync('git rev-parse --short HEAD').toString().trim();
const commitShaFull = execSync('git rev-parse HEAD').toString().trim();

const envPaths = [
  path.join(root, 'src/environments/environment.ts'),
  path.join(root, 'src/environments/environment.prod.ts'),
];

async function updateEnvironmentFiles() {
  for (const envPath of envPaths) {
    try {
      let envContent = await fs.readFile(envPath, 'utf8');

      envContent = envContent.replace(/commitSha:\s*'[^']*'/, `commitSha: '${commitShaShort}'`);

      if (/commitShaFull:\s*'[^']*'/.test(envContent)) {
        envContent = envContent.replace(/commitShaFull:\s*'[^']*'/, `commitShaFull: '${commitShaFull}'`);
      } else {
        envContent = envContent.replace(
          /commitSha:\s*'[^']*'/,
          (match) => `${match},\n  commitShaFull: '${commitShaFull}'`,
        );
      }

      await fs.writeFile(envPath, envContent, 'utf8');
      console.log(`Updated ${envPath}`);
    } catch (error) {
      console.error(`Error updating ${envPath}: ${(error as Error).message}`);
    }
  }
}

updateEnvironmentFiles().then(() => console.log('Done'));
