## Instalación local 

Vea aquí algunos ejemplos: https://github.com/naptha/tesseract.js/blob/master/docs/examples.md  

En el entorno del navegador, `tesseract.js` simplemente proporciona la capa API.  Internamente, abre un WebWorker para manejar las solicitudes.  Ese trabajador por sí mismo carga el código del "tesseract.js-core" construido por Emscripten, que a su vez está alojado en un CDN.  Luego carga dinámicamente archivos de lenguaje alojados en otro CDN. 

Por eso recomendamos cargar el `tesseract.js` desde un CDN.  Pero si realmente necesitas tener todos tus archivos locales, puedes pasarle argumentos extra a `TesseractWorker` para especificar rutas personalizadas para los trabajadores, los idiomas y el núcleo. 

En el entorno de Node.js, la única ruta que puedes querer personalizar es languages/langPath. 

```javascript
Tesseract.recognize(image, langs, {
  workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
})
```

Or

```javascript
const worker = createWorker({
  workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
});
```

### workerPath
Una cadena que especifica la ubicación del archivo [trabajador.js](./dist/trabajador.min.js).

### langPath
Una cadena que especifica la ubicación de los archivos del lenguaje tesseract, con el valor por defecto 'https://tessdata.projectnaptha.com/4.0.0'. Las URL de los archivos de idioma se calculan según la fórmula "langPath + langCode + '.traineddata.gz'`.

### corePath
Una cadena que especifica la ubicación de la [biblioteca tesseract.js-core](https://github.com/naptha/tesseract.js-core), con el valor por defecto '_COPY13@v2.0.0/tesseract-core.wasm.js' (se utiliza tesseract-core.asm.js cuando el WebAssembly no está disponible).

Otra opción de WASM es '_COPY13@v2.0.0/tesseract-core.js' que es un script que carga '_COPY13@v2.0.0/tesseract-core.wasm'. Pero no se carga en este momento.
