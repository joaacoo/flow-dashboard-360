const fs = require('fs');
try {
    fs.writeFileSync('diagnostic.txt', 'Hello from diagnostic script');
    console.log('Diagnostic script ran successfully');
} catch (e) {
    console.error('Error writing file:', e);
}
