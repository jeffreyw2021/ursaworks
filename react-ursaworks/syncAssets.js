const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'assets');
const destDir = path.join(__dirname, 'public', 'assets');

async function removeExtraFiles(src, dest) {
  const srcFiles = await fs.readdir(src);
  const destFiles = await fs.readdir(dest);

  for (const file of destFiles) {
    if (!srcFiles.includes(file)) {
      await fs.remove(path.join(dest, file));
    } else {
      const srcFilePath = path.join(src, file);
      const destFilePath = path.join(dest, file);
      const srcStat = await fs.stat(srcFilePath);
      if (srcStat.isDirectory()) {
        await removeExtraFiles(srcFilePath, destFilePath);
      }
    }
  }
}

fs.copySync(srcDir, destDir, { overwrite: true });

removeExtraFiles(srcDir, destDir)
  .then(() => console.log('Assets successfully synced and cleaned.'))
  .catch(err => console.error('Error syncing assets:', err));
