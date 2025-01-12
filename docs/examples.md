# Tesseract.js Ejemplos

También puede consultar [ejemplos](../examples) folder.

### básico

```javascript
const { createWorker } = require('tesseract.js');

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### con un progreso detallado 

```javascript
const { createWorker } = require('tesseract.js');

const worker = createWorker({
  logger: m => console.log(m), // Add logger here
});

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### con múltiples idiomas, separados por '+'.

```javascript
const { createWorker } = require('tesseract.js');

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng+chi_tra');
  await worker.initialize('eng+chi_tra');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```
### con el carácter de lista blanca (^2.0.0-beta.1)

```javascript
const { createWorker } = require('tesseract.js');

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### con un modo diferente de pageseg (^2.0.0-beta.1)

Check here for more details of pageseg mode: https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163

```javascript
const { createWorker, PSM } = require('tesseract.js');

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  });
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  console.log(text);
  await worker.terminate();
})();
```

### con salida en pdf (^2.0.0-beta.1)

Por favor, compruebe la carpeta de **ejemplos** para más detalles.

Browser: [download-pdf.html](../examples/browser/download-pdf.html)
Node: [download-pdf.js](../examples/node/download-pdf.js)

### con sólo una parte de la imagen (^2.0.1)

**Un rectángulo**

```javascript
const { createWorker } = require('tesseract.js');

const worker = createWorker();
const rectangle = { left: 0, top: 0, width: 500, height: 250 };

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', { rectangle });
  console.log(text);
  await worker.terminate();
})();
```

**Múltiples rectángulos**

```javascript
const { createWorker } = require('tesseract.js');

const worker = createWorker();
const rectangles = [
  {
    left: 0,
    top: 0,
    width: 500,
    height: 250,
  },
  {
    left: 500,
    top: 0,
    width: 500,
    height: 250,
  },
];

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const values = [];
  for (let i = 0; i < rectangles.length; i++) {
    const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png', { rectangle: rectangles[i] });
    values.push(text);
  }
  console.log(values);
  await worker.terminate();
})();
```

**Múltiples Rectángulos (con programador para hacer el reconocimiento en paralelo)**

```javascript
const { createWorker, createScheduler } = require('tesseract.js');

const scheduler = createScheduler();
const worker1 = createWorker();
const worker2 = createWorker();
const rectangles = [
  {
    left: 0,
    top: 0,
    width: 500,
    height: 250,
  },
  {
    left: 500,
    top: 0,
    width: 500,
    height: 250,
  },
];

(async () => {
  await worker1.load();
  await worker2.load();
  await worker1.loadLanguage('eng');
  await worker2.loadLanguage('eng');
  await worker1.initialize('eng');
  await worker2.initialize('eng');
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  const results = await Promise.all(rectangles.map((rectangle) => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png', { rectangle })
  )));
  console.log(results.map(r => r.data.text));
  await scheduler.terminate();
})();
```

### con múltiples trabajadores para acelerar (^2.0.0-beta.1)

```javascript
const { createWorker, createScheduler } = require('tesseract.js');

const scheduler = createScheduler();
const worker1 = createWorker();
const worker2 = createWorker();

(async () => {
  await worker1.load();
  await worker2.load();
  await worker1.loadLanguage('eng');
  await worker2.loadLanguage('eng');
  await worker1.initialize('eng');
  await worker2.initialize('eng');
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const results = await Promise.all(Array(10).fill(0).map(() => (
    scheduler.addJob('recognize', 'https://tesseract.projectnaptha.com/img/eng_bw.png')
  )))
  console.log(results);
  await scheduler.terminate(); // It also terminates all workers.
})();
```
