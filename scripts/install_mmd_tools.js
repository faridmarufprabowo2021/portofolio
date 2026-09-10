import https from 'https';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const zipUrl = 'https://github.com/UuuNyaa/blender_mmd_tools/archive/refs/heads/main.zip';
const tempDir = process.env.TEMP || 'C:\\Windows\\Temp';
const tmpZip = path.join(tempDir, 'mmd_tools_main.zip');
const targetAddonDir = path.join(process.env.APPDATA || '', 'Blender Foundation', 'Blender', '5.2', 'scripts', 'addons');

if (!fs.existsSync(targetAddonDir)) {
  fs.mkdirSync(targetAddonDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status: ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading mmd_tools...');
  await download(zipUrl, tmpZip);
  console.log('Downloaded to', tmpZip);

  const extractDir = path.join(tempDir, 'mmd_tools_extract');
  if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true });
  fs.mkdirSync(extractDir, { recursive: true });

  const psCmd = `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${tmpZip}' -DestinationPath '${extractDir}' -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  console.log('Extracted zip successfully.');

  const innerDir = path.join(extractDir, 'blender_mmd_tools-main', 'mmd_tools');
  const destDir = path.join(targetAddonDir, 'mmd_tools');

  if (fs.existsSync(destDir)) fs.rmSync(destDir, { recursive: true, force: true });

  if (fs.existsSync(innerDir)) {
    fs.cpSync(innerDir, destDir, { recursive: true });
    console.log('Successfully installed mmd_tools to:', destDir);
  } else {
    console.error('innerDir not found:', innerDir);
  }
}

run().catch(console.error);
