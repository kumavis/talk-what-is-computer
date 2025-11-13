const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const revealSource = path.join(__dirname, 'node_modules', 'reveal.js', 'dist');
const revealDest = path.join(docsDir, 'reveal.js', 'dist');
const assetsSource = path.join(__dirname, 'assets');
const assetsDest = path.join(docsDir, 'assets');

// Create docs directory
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Copy reveal.js dist files
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy reveal.js
if (fs.existsSync(revealSource)) {
  copyRecursiveSync(revealSource, revealDest);
  console.log('✓ Copied reveal.js files');
}

// Copy assets folder
if (fs.existsSync(assetsSource)) {
  copyRecursiveSync(assetsSource, assetsDest);
  console.log('✓ Copied assets folder');
}

// Read and modify index.html
const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Replace node_modules paths with relative paths
const builtHtml = indexHtml
  .replace(/node_modules\/reveal\.js\/dist\//g, 'reveal.js/dist/');

// Write to docs/index.html
fs.writeFileSync(path.join(docsDir, 'index.html'), builtHtml);
console.log('✓ Created docs/index.html');

console.log('\n✓ Build complete! Files are ready in the docs/ folder for GitHub Pages.');
console.log('  Make sure to set GitHub Pages source to the "docs" folder in your repository settings.');

