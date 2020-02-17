let TesseractCore = null;
/*
 * getCore is a sync function to load and return
 * TesseractCore.
 */
module.exports = (_, res) => {
  if (TesseractCore === null) {
    res.progress({ status: 'cargando tesseract núcleo', progress: 0 });
    TesseractCore = require('tesseract.js-core');
    res.progress({ status: 'cargando tesseract núcleo', progress: 1 });
  }
  return TesseractCore;
};
