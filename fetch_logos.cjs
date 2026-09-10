const fs = require('fs');
const https = require('https');
const http = require('http');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        console.log('Redirecting to:', redirectUrl);
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved ${dest} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    });
    req.on('error', reject);
  });
}

async function main() {
  // Check seeklogo markdown
  const md = fs.readFileSync('C:/Users/PERSONAL/.gemini/antigravity-cli/brain/c07a87b0-3a55-4794-a0e6-52ac67f9284b/.system_generated/steps/980/content.md', 'utf8');
  const urls = md.match(/https?:\/\/[^\s\)\"'\>]+\.(?:png|svg|jpg|jpeg)/gi) || [];
  console.log('Found URLs in markdown:', urls);

  // Download UMS
  const candidateUmsUrls = [
    'https://images.seeklogo.com/logo-png/33/1/ums-logo-png_seeklogo-337336.png',
    'https://seeklogo.com/images/U/ums-logo-B4FD51DC0B-seeklogo.com.png',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
  ];

  for (const u of candidateUmsUrls) {
    try {
      console.log('Trying UMS URL:', u);
      await downloadFile(u, 'public/assets/logo_ums.png');
      break;
    } catch (err) {
      console.warn('Failed:', err.message);
    }
  }

  // Verify MAN 1 Surakarta logo
  if (fs.existsSync('public/assets/logo_man1ska.png')) {
    console.log('MAN 1 SKA Logo exists, size:', fs.statSync('public/assets/logo_man1ska.png').size);
  }
}

main().catch(console.error);
