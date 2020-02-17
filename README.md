<p align="center">
<a href="https://tesseract.projectnaptha.com/"><img width="256px" height="256px" alt="Tesseract.js" src="./docs/images/tesseract.png"></a>
</p>

[![Build Status](https://travis-ci.org/naptha/tesseract.js.svg?branch=master)](https://travis-ci.org/naptha/tesseract.js)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://github.com/naptha/tesseract.js) 
[![Financial Contributors on Open Collective](https://opencollective.com/tesseractjs/all/badge.svg?label=financial+contributors)](https://opencollective.com/tesseractjs) [![npm version](https://badge.fury.io/js/tesseract.js.svg)](https://badge.fury.io/js/tesseract.js)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/naptha/tesseract.js/graphs/commit-activity)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Downloads Total](https://img.shields.io/npm/dt/tesseract.js.svg)](https://www.npmjs.com/package/tesseract.js)
[![Downloads Month](https://img.shields.io/npm/dm/tesseract.js.svg)](https://www.npmjs.com/package/tesseract.js)
[![Actions Panel](https://img.shields.io/badge/actionspanel-enabled-brightgreen)](https://www.actionspanel.app/app/blyzer/tesseract.js)

<h3 align="center">
 La versión 2 ya está disponible y en desarrollo en la rama maestra, lea una historia sobre v2: <a href="https://medium.com/@jeromewus/why-i-refactor-tesseract-js-v2-50f750a9cfe2">Why I refactor tesseract.js v2?</a><br>
  Comprobar el <a href="https://github.com/naptha/tesseract.js/tree/support/1.x">soporte / 1.x</a> rama para la versión 1
</h3>

<br>

Tesseract.js es una librería de javascript que introduce palabras en [almost any language](./docs/tesseract_lang_list.md) de las imágenes. ([Demo](http://tesseract.projectnaptha.com/))

Reconocimiento de imágenes

[![fancy demo gif](./docs/images/demo.gif)](http://tesseract.projectnaptha.com)

Video Reconocimiento en tiempo real

<p align="center">
  <a href="https://github.com/jeromewu/tesseract.js-video"><img alt="Tesseract.js Video" src="./docs/images/video-demo.gif"></a>
</p>


Tesseract.js envuelve un [emscripten](https://github.com/kripken/emscripten) [port](https://github.com/naptha/tesseract.js-core) del [Tesseract](https://github.com/tesseract-ocr/tesseract) [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) Motor.
Funciona en el navegador usando [webpack](https://webpack.js.org/) o etiquetas de escritura simple con un [CDN](#CDN) y en el servidor con [Node.js](https://nodejs.org/en/).
Después de ti [install it](#installation), Usarlo es tan simple como:

```javascript
import Tesseract from 'tesseract.js';

Tesseract.recognize(
  'https://tesseract.projectnaptha.com/img/eng_bw.png',
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(text);
})
```

O más imperativo

```javascript
import { createWorker } from 'tesseract.js';

const worker = createWorker({
  logger: m => console.log(m)
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

[Check out the docs](#docs) para una explicación completa de la API.


## Cambios importantes en la v2
- Actualizar a tesseract v4.1 (usando emscripten 1.38.45)
- Soporta varios idiomas al mismo tiempo, por ejemplo: eng+chi\_tra para el inglés y el chino tradicional
- Formatos de imagen soportados: png, jpg, bmp, pbm
- Soportar WebAssembly (volver a ASM.js cuando el navegador no lo soporte)
- Tipografía de apoyo


## Instalación
Tesseract.js funciona con una etiqueta `<script>` a través de una copia local o CDN, con un webpack a través de `npm` y en Node.js con `npm/yarn`.


### CDN
```html
<!-- v2 -->
<script src='https://unpkg.com/tesseract.js@v2.0.2/dist/tesseract.min.js'></script>

<!-- v1 -->
<script src='https://unpkg.com/tesseract.js@1.0.19/src/index.js'></script>
```
Después de incluir el guión la variable `Tesseract` estará disponible globalmente.


### Node.js

**Tesseract.js actualmente requiere Node.js v6.8.0 o superior**

```shell
# For v2
npm install tesseract.js
yarn add tesseract.js

# For v1
npm install tesseract.js@1
yarn add tesseract.js@1
```


## Documentación

* [Examples](./docs/examples.md)
* [Image Format](./docs/image-format.md)
* [API](./docs/api.md)
* [Local Installation](./docs/local-installation.md)
* [FAQ](./docs/faq.md)

## Usa tesseract.js de la manera que te gusta!

- Versión Fuera de línea: https://github.com/jeromewu/tesseract.js-offline
- Versión Electron: https://github.com/jeromewu/tesseract.js-electron
- Data Entrenada Personalizada: https://github.com/jeromewu/tesseract.js-custom-traineddata
- Chrome Extensión: https://github.com/jeromewu/tesseract.js-chrome-extension
- Con Vue: https://github.com/jeromewu/tesseract.js-vue-app
- Con Angular: https://github.com/jeromewu/tesseract.js-angular-app
- Con React: https://github.com/jeromewu/tesseract.js-react-app
- Typescript: https://github.com/jeromewu/tesseract.js-typescript
- Video Real-time Recognition: https://github.com/jeromewu/tesseract.js-video

## Contribuyendo

### Desarrollo
Para ejecutar una copia de desarrollo de Tesseract.js haga lo siguiente:
```shell
# Primero clonamos el depósito
git clone https://github.com/naptha/tesseract.js.git
cd tesseract.js

# Luego instalamos las dependencias
npm install

# Y finalmente iniciamos el servidor de desarrollo
npm start
```

El servidor de desarrollo estará disponible en http://localhost:3000/examples/browser/demo.html en su navegador favorito.
Reconstruirá automáticamente `tesseract.dev.js` y `worker.dev.js` cuando cambie los archivos en la carpeta **src**..

### Configuración en línea con un solo clic

Puedes usar Gitpod (un código VS online gratuito como el IDE) para contribuir. Con un solo clic se lanzará un espacio de trabajo listo para codificar con los scripts de construcción y arranque ya en proceso y en unos pocos segundos hará girar el servidor de desarrollo para que puedas empezar a contribuir de inmediato sin perder tiempo. 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/naptha/tesseract.js/blob/master/examples/browser/demo.html)

### Construir archivos estáticos
Para construir los archivos estáticos compilados, simplemente ejecute lo siguiente:
```shell
npm run build
```
Esto hará que los archivos salgan en el directorio `dist'.

## Contribuyentes

### Code Contributors

Este proyecto existe gracias a todas las personas que contribuyen. [[Contribuir](CONTRIBUIR.md)].
<a href="https://github.com/naptha/tesseract.js/graphs/contributors"><img src="https://opencollective.com/tesseractjs/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Conviértase en un contribuyente financiero y ayúdenos a mantener nuestra comunidad. [[Contribuya](https://opencollective.com/tesseractjs/contribute)]

#### Individuos

<a href="https://opencollective.com/tesseractjs"><img src="https://opencollective.com/tesseractjs/individuals.svg?width=890"></a>

#### Organizaciones

Apoye este proyecto con su organización. Su logo aparecerá aquí con un enlace a su sitio web. [[Contribuir](https://opencollective.com/tesseractjs/contribute)]

<a href="https://opencollective.com/tesseractjs/organization/0/website"><img src="https://opencollective.com/tesseractjs/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/1/website"><img src="https://opencollective.com/tesseractjs/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/2/website"><img src="https://opencollective.com/tesseractjs/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/3/website"><img src="https://opencollective.com/tesseractjs/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/4/website"><img src="https://opencollective.com/tesseractjs/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/5/website"><img src="https://opencollective.com/tesseractjs/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/6/website"><img src="https://opencollective.com/tesseractjs/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/7/website"><img src="https://opencollective.com/tesseractjs/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/8/website"><img src="https://opencollective.com/tesseractjs/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/tesseractjs/organization/9/website"><img src="https://opencollective.com/tesseractjs/organization/9/avatar.svg"></a>
