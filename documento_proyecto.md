# Documento del proyecto Integrative

## Variables principales usadas en el proyecto

Estas son las variables, props e identificadores más relevantes que aparecen en `src`:

- `root`: raíz creada en `src/index.js` con `ReactDOM.createRoot(...)`.
- `App`: componente principal de la aplicación.
- `reportWebVitals`: función que reporta métricas de rendimiento.
- `onPerfEntry`: parámetro usado por `reportWebVitals` para recibir métricas.
- `text`: prop usada por `Title` y `TextBody` para mostrar contenido dinámico.
- `linkElement`: variable de prueba usada en `App.test.js`.

También aparecen estos componentes principales:

- `LogoHeader`
- `LinksNavBar`
- `Title`
- `TextBody`
- `ImageBody`
- `Contact`
- `FooterLogo`

## Diagramas por archivo

### `src/index.js`

```mermaid
tree
src
└── index.js
    └── root
```

Variable: `root`.
 Crea y monta la aplicación React dentro del elemento HTML con id `root`.

### `src/App.js`

```mermaid
tree
src
└── App.js
    └── App
```

Variable/componente: `App`.
 Organiza la estructura principal de toda la aplicación y reúne los componentes visuales.

### `src/body/imageBody.js`

```mermaid
tree
src
└── body
    └── imageBody.js
        └── ImageBody
```

Variable/componente: `ImageBody`.
 Muestra el bloque de imagen o contenido visual dentro de la sección del cuerpo.

### `src/body/textBody.js`

```mermaid
tree
src
└── body
    └── textBody.js
        └── TextBody
            └── text
```

Variable/componente: `TextBody` y prop `text`.
 Recibe un texto por prop y lo muestra como párrafo en pantalla.

### `src/header/title.js`

```mermaid
tree
src
└── header
    └── title.js
        └── Title
            └── text
```

Variable/componente: `Title` y prop `text`.
 Recibe un título dinámico y lo muestra como encabezado principal.

### `src/header/linksNavBar.js`

```mermaid
tree
src
└── header
    └── linksNavBar.js
        └── LinksNavBar
```

Variable/componente: `LinksNavBar`.
 Muestra los enlaces de navegación del menú superior.

### `src/header/logoHeader.js`

```mermaid
tree
src
└── header
    └── logoHeader.js
        └── LogoHeader
```

Variable/componente: `LogoHeader`.
 Muestra el logo o nombre principal en la cabecera.

### `src/footer/contact.js`

```mermaid
tree
src
└── footer
    └── contact.js
        └── Contact
```

Variable/componente: `Contact`.
 Muestra la información o texto de contacto en el pie de página.

### `src/footer/logo.js`

```mermaid
tree
src
└── footer
    └── logo.js
        └── FooterLogo
```

Variable/componente: `FooterLogo`.
 Muestra la marca o firma visual del pie de página.

### `src/reportWebVitals.js`

```mermaid
tree
src
└── reportWebVitals.js
    └── reportWebVitals
        └── onPerfEntry
```

Variable/componente: `reportWebVitals` y parámetro `onPerfEntry`.
 Registra métricas de rendimiento y las envía a una función cuando existe.

## Estructura en árbol del proyecto

```mermaid
tree
Integrative
├── package.json
├── package-lock.json
├── README.md
├── public
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── body
    │   ├── imageBody.css
    │   ├── imageBody.js
    │   ├── subtitle.css
    │   ├── subtitle.js
    │   ├── textBody.css
    │   └── textBody.js
    ├── footer
    │   ├── contact.css
    │   ├── contact.js
    │   ├── logo.css
    │   └── logo.js
    ├── header
    │   ├── linksNavBar.css
    │   ├── linksNavBar.js
    │   ├── logoHeader.css
    │   ├── logoHeader.js
    │   ├── title.css
    │   └── title.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js
```

## Resumen corto de la estructura

- `public/` contiene el HTML base y archivos estáticos.
- `src/` contiene toda la lógica y los componentes React.
- `src/header/` agrupa componentes de la parte superior de la página.
- `src/body/` agrupa el contenido central.
- `src/footer/` agrupa el pie de página.
