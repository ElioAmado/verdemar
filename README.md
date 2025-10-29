# Verdemar Project

## 🌿 Descripción

Este proyecto es una aplicación web para la gestión de apartamentos, clientes y reservas. Se compone de un frontend desarrollado con **Next.js** y **TypeScript**, y un backend construido con **Spring Boot** que expone una API REST.

El frontend consume los endpoints expuestos por la API para realizar operaciones CRUD sobre apartamentos, reservas y clientes.

---

## 📁 Estructura del proyecto

├── api # Servicios para consumir la API REST
├── app # Rutas y páginas de Next.js
├── components # Componentes reutilizables
├── contexts # Contextos globales con React
├── hooks # Custom Hooks
├── lib # Funciones auxiliares
├── locales # Internacionalización
├── public # Recursos estáticos
├── styles # Estilos globales y configuración Tailwind
├── config.env # Archivo con variables de entorno
├── tailwind.config.ts # Configuración de Tailwind CSS
├── package.json # Información del proyecto y scripts
├── pnpm-lock.yaml # Lockfile de dependencias con pnpm

---

## ⚙️ Variables de entorno

Se utiliza el archivo `config.env` en la raíz del proyecto para configurar las variables necesarias.  
Asegúrate de que las variables estén prefijadas con `NEXT_PUBLIC_` para que Next.js las exponga al cliente.

Ejemplo:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

Nota: Cada vez que modifiques este archivo, reinicia el servidor de desarrollo para que los cambios surtan efecto.

🚀 Uso de pnpm

Este proyecto utiliza pnpm por su rapidez y eficiencia en la gestión de paquetes.

📦 Instalación de dependencias

pnpm install

🧪 Desarrollo

pnpm run dev

🛠️ Build de producción

pnpm run build

▶️ Ejecutar en producción

pnpm start
```
