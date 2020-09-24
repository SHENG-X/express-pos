/* eslint-disable no-console */
const fs = require('fs');

const genImagePath = (key) => `static/${key}.jpg`;

const writeImageFile = (thumbnail, itemId) => {
  const image = thumbnail.split(',')[1];
  const bitmap = Buffer.from(image, 'base64');
  fs.writeFileSync(genImagePath(itemId), bitmap);
};

const removeImageFile = (itemId) => {
  try {
    if (fs.existsSync(genImagePath(itemId))) {
      // check if file exist first, if exist then remove
      fs.unlinkSync(genImagePath(itemId));
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  writeImageFile,
  removeImageFile,
};
