# Games5150 - Frontend

Este repositorio contiene la Interfaz de Usuario (UI) para el Trabajo Integrador Final, un catálogo de videojuegos desarrollado con React.

## Tecnologías
- **React (Vite)**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**

## Funcionalidades Principales
- Búsqueda con autocompletado
- Catálogo de juegos con filtros
- Autenticación y rutas protegidas
- Panel de Administración (CRUD)
- Lista de Deseados (Wishlist)
- Diseño responsivo

## Despliegue (Producción)

Este proyecto se encuentra alojado en un **VPS propio configurado con Docker y Dokploy**, garantizando un entorno de producción estable y escalable.

- **Frontend (Web):** [https://games5150.online](https://games5150.online)
- **Backend (API):** [https://api.games5150.online](https://api.games5150.online)

## Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPO>
   cd games5150-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno (`.env`):
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## Credenciales de Prueba

- **Admin**: `admin@games5150.online` / `Admin1234!`
- **Usuario**: `user@games5150.online` / `User1234!`
