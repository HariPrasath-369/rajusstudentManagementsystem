const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src/pages');
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('services/api/')) {
        content = content.replace(/services\/api\//g, 'services/');
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed', f);
    }
});
