# Guía de Preguntas Técnicas - Presentación Games5150

Esta guía contiene posibles preguntas que los profesores podrían hacerte durante la presentación de tu Trabajo Integrador Final, junto con las explicaciones técnicas, el "por qué" de tus decisiones y las rutas exactas donde se encuentra el código para que puedas mostrarlo rápidamente.

---

## 1. Enrutamiento y Seguridad (Rutas Protegidas)

**Pregunta:** *¿Cómo manejaste el acceso a las distintas páginas? ¿Cómo evitas que un usuario no autenticado entre al panel de administración o a su lista de deseados?*

**Cómo lo hiciste:**
Utilicé la librería `react-router-dom` para manejar el enrutamiento y creé un componente personalizado llamado `ProtectedRoute` que actúa como un "guardia" o "middleware" de las rutas.

**Por qué lo hiciste así:**
Porque es la forma estándar y más segura en React de encapsular la lógica de autorización. En lugar de verificar si el usuario está logueado en cada página individualmente de forma manual, envuelvo las rutas sensibles con este componente. Si el usuario no tiene permisos (o no está logueado), lo redirecciono automáticamente, manteniendo el código DRY (Don't Repeat Yourself).

**Dónde mostrarlo:**
- **Ruta principal:** `src/App.jsx`
  - Muestra cómo las rutas `<Route path="/wishlist">` y las de admin están envueltas por el componente `<Route element={<ProtectedRoute />}>`.
- **El Guardia:** `src/components/ProtectedRoute.jsx`
  - Muestra cómo usas el hook `useAuth` para verificar si hay un `user` activo.
  - Explica la lógica línea por línea: si está `loading` muestras un spinner. Si `!user` lo mandas a la vista de login (`/login`) con el componente `<Navigate>`. Si la ruta requiere admin (`adminOnly=true`) y su rol no es admin, lo mandas al inicio (`/`).

---

## 2. Manejo de Estado Global (Autenticación)

**Pregunta:** *¿Cómo manejas el estado del usuario logueado en toda la aplicación? ¿Por qué no usaste Redux?*

**Cómo lo hiciste:**
No usé Redux, utilicé la **Context API** nativa de React junto con un Custom Hook llamado `useAuth`.

**Por qué lo hiciste así:**
Para este proyecto, el estado global principal que necesitaba compartir entre múltiples componentes (Navbar, Rutas Protegidas, Páginas) era únicamente la información del usuario autenticado. Redux hubiera sido una sobreingeniería (muy complejo, mucha configuración inicial o "boilerplate"). Context API resuelve el problema de "prop drilling" (pasar propiedades de componente padre a hijo a nieto infinitamente) de manera elegante, nativa y directa.

**Dónde mostrarlo:**
- **El Contexto:** `src/context/AuthContext.jsx`
  - Muestra cómo creas el contexto (`createContext`) y el proveedor (`AuthProvider`).
  - Muestra el `useEffect` que se ejecuta al arrancar la app: lee el `access_token` del `localStorage` y hace una petición a la API (`/auth/me`) para recuperar la sesión sin que el usuario tenga que loguearse de nuevo.
  - Explica las funciones `login` y `logout` que actualizan el estado y limpian el `localStorage`.
- **El Custom Hook:** `src/hooks/useAuth.js`
  - Explica que creaste este archivo para que en cualquier componente de la app solo tengas que importar `useAuth()` y sacar al usuario de forma rápida, en vez de usar `useContext(AuthContext)` en todos lados.

---

## 3. Comunicación con el Backend y Tokens

**Pregunta:** *¿Cómo te comunicas con la API en el backend? ¿Cómo envías el token de seguridad para acceder a información privada de cada usuario?*

**Cómo lo hiciste:**
Usé la librería `axios` y configuré una **instancia global con interceptores**.

**Por qué lo hiciste así:**
En lugar de importar `axios` y poner la URL del backend y el token manualmente en cada componente (Home, Login, Admin, etc.), creé una instancia centralizada. El "interceptor" es un middleware del lado del frontend: intercepta cada petición antes de que salga hacia el backend y automáticamente le inyecta el encabezado (Header) `Authorization: Bearer <token>`. Esto centraliza la lógica, evita código duplicado y previene el error humano de olvidarse enviar el token.

**Dónde mostrarlo:**
- **Instancia de Axios:** `src/api/axios.js`
  - Muestra la creación de la instancia (`axios.create`) definiendo la URL base.
  - Muestra la sección de `api.interceptors.request.use(...)` donde obtienes el token de `localStorage` y lo agregas a `config.headers.Authorization`.

---

## 4. Variables de Entorno

**Pregunta:** *Veo que tu aplicación se comunica a localhost. ¿Qué pasaría si quisieras subir esto a un servidor de producción (hosting)? ¿Vas a tener que revisar el código y cambiar las URLs a mano?*

**Cómo lo hiciste:**
No. Para evitar eso implementé **Variables de Entorno**.

**Por qué lo hiciste así:**
Es una mala práctica (y un riesgo de seguridad) "hardcodear" (escribir textualmente en el código) URLs, claves de APIs o contraseñas. Vite nos permite manejar variables de entorno. Si estoy desarrollando, Vite usa la variable local (localhost). Cuando el proyecto se suba a Vercel/Netlify, tomará la variable de entorno de producción que se haya configurado allí.

**Dónde mostrarlo:**
- **El archivo de variables:** Archivo `.env` (o `.env.local`) en la raíz del proyecto.
- **El uso en el código:** `src/api/axios.js`
  - Muestra la línea: `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'` y explica que `import.meta.env` es la sintaxis de Vite para leerlas.

---

## 5. Arquitectura del Proyecto (Vite y Carpetas)

**Pregunta:** *¿Por qué elegiste Vite en lugar del clásico Create React App (CRA)? ¿Cómo estructuraste las carpetas de tu frontend?*

**Cómo lo hiciste y por qué:**
- **Vite:** Elegí Vite porque Create React App ya está obsoleto (deprecated por el equipo de React). Vite es la herramienta moderna estándar; usa ES Modules de forma nativa en el navegador, lo que hace que el servidor local arranque en milisegundos y los cambios en el código se reflejen al instante (HMR - Hot Module Replacement).
- **Estructura de carpetas:** Adopté una separación de responsabilidades para tener el código ordenado y escalable:
  - `components/`: Partes pequeñas y reutilizables de la UI (Navbar, GameCard, Botones).
  - `pages/`: Las vistas enteras y principales a las que nos lleva el enrutador (Home, GameDetail, Login).
  - `context/` y `hooks/`: Para la lógica de negocio y estados globales (Autenticación).
  - `api/`: Para la configuración de red.

**Dónde mostrarlo:**
- Abre el `package.json` para mostrar que usas los comandos de `vite` para correr el proyecto.
- Despliega la carpeta `src/` en el panel lateral de tu editor para que vean el orden.

---

## 6. Estilos y Diseño Visual (Tailwind CSS)

**Pregunta:** *¿Qué utilizaste para darle estilo a la página y cómo lograste que sea responsiva (adaptable a celulares)?*

**Cómo lo hiciste:**
Utilicé **Tailwind CSS**.

**Por qué lo hiciste así:**
A diferencia del CSS tradicional o de librerías de componentes (como Bootstrap), Tailwind es un framework de CSS "utility-first" (primero utilidades). Esto me permitió maquetar rápidamente desde el mismo archivo de React (`.jsx`) usando clases predefinidas como `flex`, `p-4`, o utilidades condicionales como `md:grid-cols-3` (para pantallas medianas).
- Evita el problema clásico de buscar nombres para las clases CSS.
- Hace el proyecto fácil de mantener porque el estilo vive con el componente.
- Tailwind elimina el CSS que no usas cuando hace el empaquetado para producción, por lo que la página final carga muchísimo más rápido.

**Dónde mostrarlo:**
- Abre `tailwind.config.js` y `src/index.css` para mostrar dónde está configurado.
- Abre un componente cualquiera, por ejemplo el `App.jsx` o un botón, y muestra el `className="flex min-h-screen bg-background..."`.
