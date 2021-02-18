const fs = require('fs');
const path = require('path');
const { temp } = require('../utils/index');

const createMigrationFile = async (model, fields, callback) => new Promise((res) => {
  const file = temp.fileSync({
    prefix: 'migration-',
    postfix: '.js',
  });

  const content = `
    const target = ${JSON.stringify(model)};
    const fields = ${JSON.stringify(fields)};
  `;

  const script = fs.readFileSync(path.join(__dirname, './update-fields.js'), {
    encoding: 'utf-8',
  });

  fs.writeFile(file.name, content + script, async (err) => {
    if (err) {
      throw new Error('Error trying to write file');
    }
    await callback(file.name);
    res(true);
  });
});

module.exports = createMigrationFile;

