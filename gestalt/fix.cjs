const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/fontFamily:\s*'Oswald',\s*sans-serif,/g, "fontFamily: '\"Oswald\", sans-serif',");
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
  }
});
