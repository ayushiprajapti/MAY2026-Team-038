import fs from 'fs';
import https from 'https';
import path from 'path';

// Known working public domain / CC0 sound links from freesound previews or archive.org
const sounds = {
  fort: 'https://ia800902.us.archive.org/21/items/WindInTrees/WindInTrees.mp3',
  wada: 'https://ia801306.us.archive.org/3/items/birds-singing-in-the-morning-forest/birds-singing-in-the-morning-forest.mp3',
  temple: 'https://ia801908.us.archive.org/34/items/TempleBell/TempleBell.mp3',
  stepwell: 'https://ia801509.us.archive.org/15/items/WaterStream/WaterStream.mp3'
};

const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        // Fallback for missing Archive.org items to simple tone generator files?
        console.error(`Failed to download ${url}: ${res.statusCode}`);
        resolve(false);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const [key, url] of Object.entries(sounds)) {
    console.log(`Downloading ${key}...`);
    await download(url, path.join(audioDir, `${key}.mp3`));
  }
  console.log('Done!');
}

main();
