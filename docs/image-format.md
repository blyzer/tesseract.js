# Formato de la imagen

Formato de apoyo: **bmp, jpg, png, pbm**

El principal Tesseract.js funciones (por ejemplo, reconocer, detectar) tomar una `image` que debe ser algo que sea como una imagen. Lo que se considera "image-like" difiere dependiendo de si se está ejecutando desde el navegador o a través de NodeJS.

En un navegador, una imagen puede ser:
- un "img", "video", o elemento `vancas`.
- un objeto `file`(de un archivo `<input>`)
- un objeto `Blob`...
- una ruta o URL a una imagen accesible
- una imagen codificada en base64 encaja `data:image\/([a-zA-Z]*);base64,([^"]*)` regexp

En Node.js, una imagen puede ser
- un camino hacia una imagen local
- un Buffer que almacena una imagen binaria 
- una imagen codificada en base64 encaja `data:image\/([a-zA-Z]*);base64,([^"]*)` regexp
