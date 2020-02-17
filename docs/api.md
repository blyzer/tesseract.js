# API

- [createWorker()](#create-worker)
  - [Worker.load](#worker-load)
  - [Worker.loadLanguage](#worker-load-language)
  - [Worker.initialize](#worker-initialize)
  - [Worker.setParameters](#worker-set-parameters)
  - [Worker.recognize](#worker-recognize)
  - [Worker.detect](#worker-detect)
  - [Worker.terminate](#worker-terminate)
- [createScheduler()](#create-scheduler)
  - [Scheduler.addWorker](#scheduler-add-worker)
  - [Scheduler.addJob](#scheduler-add-job)
  - [Scheduler.getQueueLen](#scheduler-get-queue-len)
  - [Scheduler.getNumWorkers](#scheduler-get-num-workers)
- [setLogging()](#set-logging)
- [recognize()](#recognize)
- [detect()](#detect)
- [PSM](#psm)
- [OEM](#oem)

---

<a name="create-worker"></a>
## createWorker(opciones): Trabajador

createWorker es una función de la fábrica que crea un trabajador tesseracto, un trabajador es básicamente un Trabajador Web en el navegador y el Proceso Infantil en el Nodo.

**Argumentos:**

- `opciones` un objeto de opciones personalizadas
  - Ruta `core` para el guión de tesseract-core.js.
  - El camino de `LangPath` para descargar los datos de entrenamiento, no incluye `/` al final del camino.
  - Ruta `WorkerPath` para descargar el script del trabajador.
  - `Ruta de datos` para guardar los datos entrenados en el sistema de archivos de WebAssembly, no es común modificarlos.
  - La ruta `cachePath` para los datos entrenados cacheados, más útil para el Nodo, para el navegador sólo cambia la tecla en el IndexDB
  - `cacheMethod` una cadena para indicar el método de gestión de la caché, debe ser una de las siguientes opciones
    - write: leer la caché y volver a escribir (método por defecto)
    - readOnly: leer el caché y no volver a escribir
    - refresh: no leer el caché y escribir de nuevo
    - none: no leer el caché y no volver a escribir
  - `workerBlobURL` un booleano para definir si se usa la URL de Blob para el script del trabajador, por defecto: true
  - `gzip` un booleano para definir si los datos de entrenamiento del remoto están gzipados, por defecto: true
  - `logger` una función para registrar el progreso, un ejemplo rápido es `m => console.log(m)`
  - `errorHandler` una función para manejar los errores de los trabajadores, un ejemplo rápido es `err => consola.error(err)`


**Ejemplos:**

```javascript
const { createWorker } = Tesseract;
const worker = createWorker({
  langPath: '...',
  logger: m => console.log(m),
});
```

## Trabajador

A Worker te ayuda a hacer las tareas relacionadas con el OCR, se necesitan pocos pasos para configurar el Worker antes de que sea completamente funcional. El flujo completo es:

- load
- loadLanguauge
- initialize
- setParameters // optional
- recognize or detect
- terminate

Cada función es async, así que usando async/await o se requiere una promesa. Cuando se resuelve, se obtiene un objeto:

```json
{
  "jobId": "Job-1-123",
  "data": { ... }
}
```

jobId es generado por Tesseract.js, pero puedes poner la tuya propia al llamar a cualquiera de las funciones anteriores.

<a name="worker-load"></a>
### Worker.load(jobId): Promise

Worker.load() cargas tesseract.js-core scripts (descargar desde el remoto si no se presenta), hace que el Web Worker/Child Process esté listo para la siguiente acción.

**Argumentos:**

- `jobId` Por favor, vea los detalles arriba

**Ejemplos:**

```javascript
(async () => {
  await worker.load();
})();
```

<a name="worker-load-language"></a>
### Worker.loadLanguage(langs, jobId): Promise

Worker.loadLanguage() carga datos entrenados de la caché o descarga datos entrenados a distancia, y pone datos entrenados en el WebAssembly sistema de archivos.

**Argumentos:**

- `langs` una cadena que indica los idiomas en los que se pueden descargar los datos de formación, se conectó una serie de idiomas con **+**, ex: **eng+chi\_tra**
- `jobId` Por favor, vea los detalles arriba

**Ejemplos:**

```javascript
(async () => {
  await worker.loadLanguage('eng+chi_tra');
})();
```

<a name="worker-initialize"></a>
### Worker.initialize(langs, oem, jobId): Promise

Worker.initialize() inicializa el Tesseract API, Asegúrate de que está listo para hacer OCR tareas.

**Argumentos:**

- `langs` una cadena para indicar los idiomas cargados por Tesseract API, puede ser el subconjunto de los datos de entrenamiento lingüístico que cargó desde Worker.loadLanguage.
- `oem` un enum para indicar el OCR El modo de motor que utiliza
- `jobId` Por favor, vea los detalles arriba

**Ejemplos:**

```javascript
(async () => {
  /** You can load more languages in advance, but use only part of them in Worker.initialize() */
  await worker.loadLanguage('eng+chi_tra');
  await worker.initialize('eng');
})();
```
<a name="worker-set-parameters"></a>
### Worker.setParameters(params, jobId): Promise

Worker.setParameters() establecer los parámetros para Tesseract API (using SetVariable()), cambia el comportamiento de Tesseract y algunos parámetros como tessedit\_char\_whitelist es muy útil.

**Argumentos:**

- `params` un objeto con clave y valor de los parámetros
- `jobId` Por favor, vea los detalles arriba

**Parámetros soportados:**

| name                        | type   | default value     | description                                                                                                                     |
| --------------------------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| tessedit\_ocr\_engine\_mode | enum   | OEM.DEFAULT       | Revisa [HERE](https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L268) for definition of each mode |
| tessedit\_pageseg\_mode     | enum   | PSM.SINGLE\_BLOCK | Revisa [HERE](https://github.com/tesseract-ocr/tesseract/blob/4.0.0/src/ccstruct/publictypes.h#L163) for definition of each mode |
| tessedit\_char\_whitelist   | string | ''                | El ajuste de los caracteres de la lista blanca hace que el resultado sólo contenga estos caracteres, útil el contenido en la imagen es limitado           |
| preserve\_interword\_spaces | string | '0'               | '0' or '1', keeps the space between words                                                                                       |
| tessjs\_create\_hocr        | string | '1'               | sólo 2 valores, '0' or '1', cuando el valor es '1', tesseract.js incluye hocr en el resultado                                      |
| tessjs\_create\_tsv         | string | '1'               | sólo 2 valores, '0' or '1', cuando el valor es '1', tesseract.js incluye tsv en el resultado                                       |
| tessjs\_create\_box         | string | '0'               | sólo 2 valores, '0' or '1', cuando el valor es '1', tesseract.js incluye box en el resultado                                       |
| tessjs\_create\_unlv        | string | '0'               | sólo 2 valores, '0' or '1', cuando el valor es '1', tesseract.js incluye unlv en el resultado                                      |
| tessjs\_create\_osd         | string | '0'               | sólo 2 valores, '0' or '1', cuando el valor es '1', tesseract.js incluye osd en el resultado                                       |

**Ejemplos:**

```javascript
(async () => {
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
})
```

<a name="worker-recognize"></a>
### Worker.recognize(image, options, jobId): Promise

Worker.recognize() proporciona la función básica de Tesseract.js mientras se ejecuta OCR

Figures out what words are in `image`, where the words are in `image`, etc.
> Note: `image` should be sufficiently high resolution.
> Often, the same image will get much better results if you upscale it before calling `recognize`.

**Argumentos:**

- `image` ver [Image Format](./image-format.md) para más detalles.
- `options` un objeto de opciones personalizadas
  - `rectangles` un conjunto de objetos para especificar las regiones que desea reconocer en la imagen, cada objeto debe contener la parte superior, izquierda, anchura y altura, ver ejemplo a continuación.
- `jobId` Por favor, vea los detalles arriba.

**Output:**

**Ejemplos:**

```javascript
const { createWorker } = Tesseract;
(async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(image);
  console.log(text);
})();
```

Con el rectángulo

```javascript
const { createWorker } = Tesseract;
(async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(image, {
    rectangles: [{ top: 0, left: 0, width: 100, height: 100 }],
  });
  console.log(text);
})();
```

<a name="worker-detect"></a>
### Worker.detect(image, jobId): Promise

Worker.detect() hace OSD (Orientation and Script Detection) a la imagen en lugar de OCR.

**Argumentos:**

- `image` ver [Image Format](./image-format.md) para más detalles.
- `jobId` Por favor, ver detalles arriba

**Ejemplos:**

```javascript
const { createWorker } = Tesseract;
(async () => {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data } = await worker.detect(image);
  console.log(data);
})();
```

<a name="worker-terminate"></a>
### Worker.terminate(jobId): Promise

Worker.terminate() termina con el trabajador y limpia

**Argumentos:**

- `jobId` Por favor, ver detalles arriba

```javascript
(async () => {
  await worker.terminate();
})();
```

<a name="create-scheduler"></a>
## createScheduler(): Scheduler

createScheduler() es una función de la fábrica para crear un planificador, un planificador que gestiona una cola de trabajos y trabajadores para permitir que varios trabajadores trabajen juntos, es útil cuando quieres acelerar tu rendimiento.

**Ejemplos:**

```javascript
const { createScheduler } = Tesseract;
const scheduler = createScheduler();
```

### Scheduler

<a name="scheduler-add-worker"></a>
### Scheduler.addWorker(worker): string

Scheduler.addWorker() añade un trabajador a la piscina de trabajadores dentro del planificador, se sugiere añadir un trabajador a un solo planificador.

**Argumentos:**

- `worker` ver Trabajador arriba

**Ejemplos:**

```javascript
const { createWorker, createScheduler } = Tesseract;
const scheduler = createScheduler();
const worker = createWorker();
scheduler.addWorker(worker);
```

<a name="scheduler-add-job"></a>
### Scheduler.addJob(action, ...payload): Promise

Scheduler.addJob() añade un trabajo a la cola y el programador espera y encuentra un trabajador ocioso para tomar el trabajo.

**Argumentos:**

- `action` una cadena para indicar la acción que quieres hacer, ahora mismo sólo se admiten **reconocer** y **detectar**.
- `payload` un número arbitrario de arcos dependiendo de la acción a la que llamaste.

**Ejemplos:**

```javascript
(async () => {
 const { data: { text } } = await scheduler.addJob('recognize', image, options);
 const { data } = await scheduler.addJob('detect', image);
})();
```

<a name="scheduler-get-queue-len"></a>
### Scheduler.getQueueLen(): number

Scheduler.getNumWorkers() devuelve la longitud de la cola de trabajo.

<a name="scheduler-get-num-workers"></a>
### Scheduler.getNumWorkers(): number

Scheduler.getNumWorkers() devuelve el número de trabajadores añadidos al planificador

<a name="scheduler-terminate"></a>
### Scheduler.terminate(): Promise

Scheduler.terminate() termina con todos los trabajadores añadidos, útil para hacer una limpieza rápida.

**Ejemplos:**

```javascript
(async () => {
  await scheduler.terminate();
})();
```

<a name="set-logging"></a>
## setLogging(logging: boolean)

setLogging() establece la bandera de registro, puede `setLogging(true)` para ver información detallada, útil para la depuración.

**Argumentos:**

- `logging` booleana para definir si ver los registros detallados, por defecto: false

**Ejemplos:**

```javascript
const { setLogging } = Tesseract;
setLogging(true);
```

<a name="recognize"></a>
## recognize(image, langs, options): Promise

recognize() es una función para hacer rápidamente recognize() tarea, no se recomienda su uso en una aplicación real, pero es útil cuando se quiere ahorrar tiempo.

See [Tesseract.js](../src/Tesseract.js)

<a name="detect"></a>
## detect(image, options): Promise

Los mismos antecedentes que recognize(), pero sí detecta en su lugar.

See [Tesseract.js](../src/Tesseract.js)

<a name="psm"></a>
## PSM

See [PSM.js](../src/constants/PSM.js)

<a name="oem"></a>
## OEM

See [OEM.js](../src/constants/OEM.js)
