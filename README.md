<div align="center">

# 💈 BarberOS — SaaS System for Barber Shops

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Services-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/maximopappa)

**BarberOS** es una plataforma SaaS (*Software as a Service*) de última generación diseñada para la transformación digital y gestión integral de barberías modernas. Ofrece reservas de citas sin fricción, paneles de administración en tiempo real y flujos de trabajo optimizados tanto para clientes como para barberos y administradores.

---

</div>

## 🌟 Características Principales

### 👤 Para Clientes (Portal de Citas)
- **Reserva Intuitiva:** Selección fluida de servicios (cortes, degradados, barba, grooming premium), barbero preferido, fecha y horario disponible.
- **Historial de Citas:** Consulta de citas agendadas, estados en tiempo real (programada, en servicio, completada, cancelada) y recordatorios.
- **Experiencia Móvil First:** Interfaz ultra-rápida y adaptable a cualquier dispositivo móvil o de escritorio.

### ✂️ Para Barberos (Panel Profesional)
- **Agenda Interactiva:** Control visual diario y semanal de citas asignadas.
- **Gestión de Estados de Servicio:** Transición con un solo clic de cita registrada $\rightarrow$ en proceso $\rightarrow$ finalizada.
- **Notas de Cliente:** Registro de observaciones personalizadas (ej. tipo de piel, preferencias de corte, productos utilizados).

### 📊 Para Administradores / Owners (Hub de Control)
- **Dashboard de Métricas:** Resumen de ingresos, citas diarias/mensuales, tasa de conversión y barberos más solicitados.
- **Gestión de Catálogo y Personal:** Alta, edición y desactivación de servicios, tarifas, horarios y miembros del equipo.
- **Simulación y Persistencia:** Sistema de estado reactivo preparado para la integración con **Cloud Firestore**.

---

## 🎨 Filosofía de Diseño

El sistema visual de **BarberOS** ha sido concebido bajo una paleta premium **Obsidian & Gold**:
- **Oscuro Elegante:** Fondos profundos `hsl(240 10% 4%)` con acabados de cristal (*glassmorphism*).
- **Detalles Dorados:** Gradientes dinámicos metálicos que proyectan exclusividad y distinción.
- **Componentes Modulares:** Construidos sobre [Radix UI](https://www.radix-ui.com/) y [Tailwind CSS](https://tailwindcss.com/) garantizando máxima accesibilidad (a11y) y rendimiento.

---

## 🛠️ Arquitectura y Tecnologías

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 + TypeScript | Componentes tipados, seguros y escalables |
| **Build Tool** | Vite 5 | HMR ultrarrápido y empaquetado optimizado |
| **Estilos** | Tailwind CSS + Lucide Icons | Diseño responsive y sistema de diseño unificado |
| **Estado Global** | Zustand + TanStack Query | Estado predictivo, liviano y reactivo |
| **Autenticación y Backend** | Firebase (Auth & Firestore) | Autenticación de usuarios, reglas de seguridad y BD no relacional en tiempo real |
| **Despliegue & Hosting** | Vercel / Firebase Hosting | Infraestructura CI/CD con CDN global y respuesta de baja latencia |

---

## 🔒 Seguridad y Buenas Prácticas

Este repositorio sigue estrictas directrices de seguridad para proyectos públicos en GitHub:
1. **Sin credenciales expuestas:** No existen API Keys, secreto ni tokens hardcoded en el código fuente.
2. **Control de Entorno (`.env`):** Las variables confidenciales se manejan mediante variables de entorno aisladas (`VITE_FIREBASE_*`).
3. **Exclusiones en Git (`.gitignore`):** Los archivos `.env`, `.env.local`, `.vercel`, artefactos de build y dependencias están completamente excluidos del control de versiones.

---

## 🚀 Instalación y Desarrollo Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/serduncant/barberos-hub.git
cd barberos-hub
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo de plantilla `.env.example` a `.env`:
```bash
cp .env.example .env
```
Edita `.env` con las credenciales de tu proyecto en **Firebase**:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:8080` para ver la aplicación en marcha.

### 5. Compilar para Producción
```bash
npm run build
```

---

## 🌐 Despliegue en Producción

### Despliegue en Vercel
1. Conecta tu cuenta de **Vercel** con tu repositorio de GitHub.
2. En la configuración del proyecto en Vercel, agrega las **Environment Variables** listadas en `.env.example`.
3. Haz push a la rama `main` y Vercel desplegará automáticamente la aplicación.

### Despliegue en Firebase Hosting
```bash
npx firebase-tools login
npx firebase-tools init hosting
npx firebase-tools deploy --only hosting
```

---

## ☕ Apoya el Proyecto

Si este proyecto te resulta útil o deseas contribuir a su desarrollo continuo, ¡puedes invitarme a un café!

<a href="https://ko-fi.com/maximopappa" target="_blank">
  <img src="https://storage.ko-fi.com/cdn/kofi2.png" alt="Invítame un café en Ko-fi" width="200" />
</a>

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
