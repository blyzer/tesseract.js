PREGUNTAS FRECUENTES
===

## ¿Cómo es que tesseract.js descargar y mantener \*.traineddata?

El modelo de lenguaje es descargado por `worker.loadLanguage()` y tienes que pasar los lenguajes a `worker.initialize()`.

Durante la descarga del modelo de lenguaje, Tesseract.js primero comprobará si \*.traineddata ya existe. (browser: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), Node.js: fs, in the folder you execute the command) If the \*.traineddata doesn't exist, it will fetch \*.traineddata.gz from [tessdata](https://github.com/naptha/tessdata), Descomprímelo y guárdalo en IndexedDB o fs, puedes borrarlo manualmente y se descargará de nuevo para ti.

## ¿Cómo puedo entrenar a mi propio \*.traineddata?

Para tesseract.js v2, compruebe [TrainingTesseract 4.00](https://github.com/tesseract-ocr/tesseract/wiki/TrainingTesseract-4.00)

Para tesseract.js v1, compruebe [Training Tesseract 3.03–3.05](https://github.com/tesseract-ocr/tesseract/wiki/Training-Tesseract-3.03%E2%80%933.05)

## ¿Cómo puedo obtener HOCR, TSV, Box, UNLV, OSD? ##

A partir de 2.0.0-beta.1, puedes obtener toda esta información en el resultado final.

```javascript
import { createWorker } from 'tesseract.js';
const worker = createWorker({
  logger: m => console.log(m)
});

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_create_box: '1',
    tessedit_create_unlv: '1',
    tessedit_create_osd: '1',
  });
  const { data: { text, hocr, tsv, box, unlv } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  console.log(hocr);
  console.log(tsv);
  console.log(box);
  console.log(unlv);
})();
```
