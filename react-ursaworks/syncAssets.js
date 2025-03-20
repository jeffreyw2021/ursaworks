const fs = require('fs-extra');
const path = require('path');

// Define asset categories for syncing from content → src/assets
const assetCategories = ['about', 'events', 'members', 'robots'];

// Paths
const contentDir = path.join(__dirname, '..', 'content', 'assets'); // External content folder
const srcDir = path.join(__dirname, 'src', 'assets'); // React project assets folder
const publicDir = path.join(__dirname, 'public', 'assets'); // Public assets folder

// Function to remove files that exist in dest but not in src
async function removeExtraFiles(src, dest) {
  try {
    if (!(await fs.pathExists(dest))) return; // If dest doesn't exist, nothing to clean

    const srcFiles = await fs.readdir(src);
    const destFiles = await fs.readdir(dest);

    for (const file of destFiles) {
      const srcFilePath = path.join(src, file);
      const destFilePath = path.join(dest, file);

      if (!srcFiles.includes(file)) {
        console.log(`🗑️ Removing extra file: ${destFilePath}`);
        await fs.remove(destFilePath);
      } else {
        const srcStat = await fs.stat(srcFilePath);
        if (srcStat.isDirectory()) {
          await removeExtraFiles(srcFilePath, destFilePath);
        }
      }
    }
  } catch (err) {
    console.error(`❌ Error cleaning up files: ${err}`);
  }
}

// Function to sync only specific asset categories from content to src/assets
async function syncToSrc() {
  try {
    console.log("🔄 Syncing specific assets from content/ to src/assets...");

    // Ensure src/assets/ exists
    await fs.ensureDir(srcDir);

    for (const category of assetCategories) {
      const contentCategoryPath = path.join(contentDir, category);
      const srcCategoryPath = path.join(srcDir, category);

      // Copy files if the content subfolder exists
      if (await fs.pathExists(contentCategoryPath)) {
        await fs.copy(contentCategoryPath, srcCategoryPath, { overwrite: true });
        console.log(`✅ Synced ${category} from content/assets/ to src/assets/`);
      } else {
        console.warn(`⚠️ Warning: ${category} folder is missing in content/assets/`);
      }

      // Remove extra files from src/assets/
      await removeExtraFiles(contentCategoryPath, srcCategoryPath);
    }
  } catch (err) {
    console.error(`❌ Error syncing assets to src/: ${err}`);
  }
}

// Function to sync the entire src/assets folder to public/assets
async function syncToPublic() {
  try {
    console.log("🔄 Syncing entire src/assets/ to public/assets...");

    // Ensure public/assets/ exists
    await fs.ensureDir(publicDir);

    // Copy all files and folders inside src/assets to public/assets
    await fs.copy(srcDir, publicDir, { overwrite: true });
    console.log(`✅ Synced entire src/assets/ to public/assets/`);

    // Remove extra files from public/assets/
    await removeExtraFiles(srcDir, publicDir);

    console.log("✅ Assets successfully synced to public.");
  } catch (err) {
    console.error(`❌ Error syncing assets to public/: ${err}`);
  }
}

// Full sync process
async function syncAssets() {
  await syncToSrc();    // Step 1: Sync only the four categories from content → src/assets
  await syncToPublic(); // Step 2: Sync the entire src/assets/ folder → public/assets
}

syncAssets();
