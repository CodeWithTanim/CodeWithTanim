import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const apiPath = path.resolve('src/app/api');
const tempApiPath = path.resolve('.api_temp');

let moved = false;
try {
  if (fs.existsSync(apiPath)) {
    console.log('Temporarily isolating API routes for static export...');
    fs.renameSync(apiPath, tempApiPath);
    moved = true;
  }

  console.log('Building Next.js static export for GitHub Pages...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_EXPORT: 'true' },
  });
  console.log('✓ Static export built successfully into ./out');
} finally {
  if (moved && fs.existsSync(tempApiPath)) {
    console.log('Restoring API routes...');
    fs.renameSync(tempApiPath, apiPath);
    console.log('✓ API routes restored');
  }
}
