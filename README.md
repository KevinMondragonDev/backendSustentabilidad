# Documentación del Backend (SustentaApp)

## 1. Introducción

Este backend provee una API REST para gestionar usuarios y publicaciones en una plataforma de blogs. Está desarrollado con **NestJS, TypeScript y PostgreSQL**.

## 2. Instalación y Configuración

### 2.1 Requisitos previos

- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **Docker y Docker Compose**
- **pnpm** como gestor de paquetes
- **NestJS CLI** (Opcional, pero recomendado):
  ```bash
  npm i -g @nestjs/cli
  ```

### 2.2 Clonar el repositorio

```bash
git clone https://github.com/KevinMondragonDev/backendSustentabilidad.git
cd backendSustentabilidad
```

### 2.3 Instalar dependencias

```bash
pnpm install
```

### 2.4 Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
JWT_SECRET='Secreto'
PORT=3002
DB_PASSWORD=root
DB_NAME=SustabilidadDB
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
```

### 2.5 Levantar la base de datos con Docker

```bash
docker-compose up -d
```

### 2.6 Ejecutar el servidor

```bash
# Modo desarrollo
pnpm run start

# Modo watch para recargar cambios
pnpm run start:dev

# Modo producción
pnpm run start:prod
```

## 3. Estructura del Proyecto

```
backendSustentabilidad/
│── dist/
│── node_modules/
│── postgres/
│── src/
│   ├── auth/
│   ├── common/
│   ├── hours_service/
│   ├── scholarships/
│   ├── seed/
│   ├── app.module.ts
│   ├── main.ts
│── .env
│── .eslintrc.js
│── .gitignore
│── .prettierrc
│── docker-compose.yaml
│── docker-compose.prod.yaml
│── nest-cli.json
│── package.json
│── pnpm-lock.yaml
│── README.md
│── tsconfig.build.json
│── tsconfig.json
```

## 4. Endpoints de la API

**Ejecutar Seed**

```
GET /api/sustentabilidad/seed
```

### 4.1 Autenticación

**Registro de usuario**

```
POST /api/sustentabilidad/auth/register
```

**Body**:

```json
{
  "email": "022000222@upsrj.edu.mx",
  "password": "Abc123",
  "fullName": "juan rosa",
  "scholarship": "academica"
}
```

**Respuesta**:

```json
{
  "email": "022000222@upsrj.edu.mx",
  "enrollment": "022000222",
  "fullName": "juan rosa",
  "isActive": true,
  "isPenalized": false,
  "roles": ["user"],
  "owed_hours": "16.00",
  "scholarship_type": {
    "id": "013d0251-febe-4625-9635-e2868cf47350",
    "scholarship_type": "academica",
    "percentage_max_range": ["80"],
    "description": "Beca por excelencia académica",
    "hours": 16
  },
  "id": "494b5bbe-54c2-4cb1-b69a-cf4a23c4ab5f"
}
```

**Inicio de sesión**

```
POST /api/sustentabilidad/auth/login
```

**Body**:

```json
{
  "email": "022000222@upsrj.edu.mx",
  "password": "Abc123"
}
```

- **Respuesta**:

```json
{
  "token": "eyJhbGciOiJI..."
}
```

**Verificación del estado**

```
GET /api/sustentabilidad/auth/status
```

**Baerer Token**

```
eyJhbGciOiJI...

```

**Penalizar usuario**

```

PATCH /api/sustentabilidad/auth/penalize/(enrollment)

Authorization: Admin Token

```

**Body**:

```json
{
  "isPenalized": "true"
}
```

**Desactivar usuario**

```
PATCH /api/sustentabilidad/auth/desactivate/(enrollment)

Authorization: Admin Token
```

- **Bearer Token**

```json
{
  "isActive": "false"
}
```

### 4.2 Gestión de Jornadas (Hours Service)

**Generar QR**

```
POST /api/sustentabilidad/hours-service/generate-qr-token

Authorization Baerer Token: Admin Token

```

**Respuesta**

```json
{
  {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "expiresIn": 300
}
}
```

**Iniciar Jornada**

```

POST /api/sustentabilidad/hours-service/start/(enrollment)

Authorization: User Token

```

**Body**

```json
{
  "qrToken": "eyJhbGciOi..."
}
```

**Respuesta**

```json
{
  "message": "Jornada iniciada correctamente",
  "start_date": "2025-03-30T05:51:14.111Z"
}
```

**Terminar Jornada**

```
POST /api/sustentabilidad/hours-service/end/(enrollment)

```

**Body**

```json
{
  "qrToken": "eyJhbGciOi..."
}
```

**Respuesta**

```json
{
  "message": "Jornada finalizada correctamente",
  "end_date": "2025-03-30T05:53:27.675Z",
  "total_hours": "0 horas y 2 minutos"
}
```

**Obtener todos los registros por usuario**

```
GET /api/sustentabilidad/hours-service/records/(enrollment)

```

**Respuesta**

```json
{
  "user": {
    "enrollment": "022000222",
    "name": "juan rosa"
  },
  "totalRecords": 6,
  "completedHours": 0.04,
  "pendingHoursFormatted": "12 horas y 23 minutos",
  "hoursRecords": [
    {
      "start_date": "2025-04-24T17:34:57.197Z",
      "end_date": "2025-04-24T17:35:01.165Z",
      "total_hours": "0.00",
      "isComplete": true
    }
  ]
}
```

**Obtener registros por usuario y fecha**

```

GET /api/sustentabilidad/hours-service/records/date/(enrollment)?month=(number)&year=(year)

```

**Respuesta**

```json
{
  "user": {
    "enrollment": "022000222",
    "name": "juan rosa"
  },
  "totalRecords": 1,
  "completedHours": 0,
  "hourRecords": [
    {
      "start_date": "2025-04-24T17:34:57.197Z",
      "end_date": "2025-04-24T17:35:01.165Z",
      "total_hours": "0.00",
      "isComplete": true
    }
  ]
}
```

## 5. Seguridad y Autenticación

- Se usa **JWT (JSON Web Token)** para autenticar a los usuarios.
- Se requiere un token en el encabezado `Authorization` para acceder a rutas protegidas.
- Los passwords se almacenan encriptados con **bcrypt.js**.

## 6. Despliegue en Producción

### 6.1 Crear el archivo `.env` con las variables de entorno de producción.

### 6.2 Construir y ejecutar la imagen con Docker

```bash
 docker-compose -f docker-compose.prod.yaml --env-file .env up --build
```

### 6.3 Recargar la imagen si ya la tenías antes

```bash
 docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

## 7. Buenas Prácticas y Consideraciones

- **Validaciones**: Se usa `class-validator` para validar los datos de entrada.
- **Manejo de errores**: Se centralizan los errores con un middleware global.
- **Documentación**: Se puede integrar con Swagger para una mejor documentación interactiva.
- **Despliegue**: Se recomienda usar **Docker**.

## 8. Autor

**Miguel Angel Garcia Espinosa** - Desarrollador Backend

**Kevin Arturo Mondragon Tapia** - Desarrollador Backend

**Noe** - Tester Backend

---

**Última actualización:** 26 de marzo de 2025
