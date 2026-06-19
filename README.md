# Games5150 - Frontend (React + Vite)

Este repositorio contiene la Interfaz de Usuario (UI) para el Trabajo Integrador Final. Se trata de un catálogo de videojuegos (tipo tienda digital) hiper-premium, con diseño avanzado, búsqueda en tiempo real, menús desplegables y un panel de administración.

## 🚀 Tecnologías
- **React (Vite)**: Framework principal para desarrollo ágil de UI.
- **Tailwind CSS**: Utilidad de clases CSS para el diseño responsivo, moderno y "Glassmorphism".
- **React Router DOM**: Enrutamiento dinámico para las páginas.
- **Axios**: Comunicación fluida mediante HTTP requests hacia la API del backend.
- **Lucide React**: Set de íconos profesionales para mejorar la interfaz visual.

## 🌟 Funcionalidades Principales
- **Sistema de Búsqueda con Autocompletado**: La barra de navegación despliega resultados instantáneos al teclear.
- **Catálogo Dinámico**: Filtrado y ordenamiento de juegos desde la base de datos (PS5, Xbox, PC, PS4, PS2).
- **Autenticación Protegida**: Manejo de rutas privadas según el estado de la sesión (Tokens JWT).
- **Panel de Administración (Admin)**: Creación, Edición y Borrado de Entidades (CRUD Completo de Juegos y Categorías/Géneros).
- **Lista de Deseados (Wishlist)**: Relación "Muchos a Muchos", los usuarios pueden guardar y eliminar sus juegos favoritos.
- **Responsive Design**: Desde 2000px hasta 320px. Pantallas perfectamente adaptables.

## 🛠 Instalación y Despliegue Local

1. **Clonar y entrar al directorio:**
   ```bash
   git clone <URL_DEL_REPO>
   cd gamecat-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   Crea un archivo `.env` en la raíz con la conexión a tu backend local:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Iniciar la aplicación:**
   ```bash
   npm run dev
   ```
   La aplicación se levantará normalmente en `http://localhost:5175`.

## 👥 Credenciales de Prueba (Para evaluar el proyecto)
Para iniciar sesión inmediatamente sin necesidad de registrarte, puedes usar estas cuentas que ya tienen su email verificado:

- **Cuenta Administrador** (Acceso al panel CRUD):
  - Email: `admin@gamecat.com`
  - Password: `Admin1234!`

- **Cuenta Usuario Normal** (Acceso a Wishlist):
  - Email: `user@gamecat.com`
  - Password: `User1234!`

---
*Desarrollado por Val-Developer.*
