# TALENTO NOVA

Plataforma móvil de empleo y currículum vitae que conecta profesionales bolivianos con empresas.
Tiene tres tipos de usuario: **candidato**, **reclutador (empresa)** y **administrador**.

| Parte | Tecnología | Carpeta |
| --- | --- | --- |
| App móvil | Expo SDK 58 · React Native 0.88 · JavaScript | `app/` |
| API REST | Node.js 22 · Express 5 · Supabase (PostgreSQL) | `backend/` |
| Base de datos | Supabase (PostgreSQL) | `backend/database/` |

```
Celular (Expo Go)  ──►  URL pública https (túnel o Render)  ──►  API REST (Express)  ──►  Supabase
Postman            ──►            "                         ──►          "            ──►     "
```

---

## 1. Base de datos (una sola vez, la hace una persona)

1. Supabase → **SQL Editor** → **New query**.
2. Pega **todo** `backend/database/01_actualizacion.sql` → **Run**. Debe decir *Success*.
   (Agrega la contraseña de los usuarios, la tabla `skills`, el historial de postulaciones y la seguridad).
3. Si fuera una base de datos **nueva y vacía**, usa `00_esquema_completo.sql` en su lugar.

> Antes de ejecutar SQL, desactiva la traducción automática de Chrome en supabase.com.

## 2. Backend (API)

```bash
cd backend
npm install
```

Crea `backend/.env` copiando `backend/.env.example` y completa:

```
PORT=3000
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
JWT_SECRET=una-frase-larga-y-secreta
JWT_EXPIRES_DAYS=7
```

Carga los datos de demostración (cuentas de prueba, empresas, ofertas, postulaciones):

```bash
npm run seed
```

Arranca la API:

```bash
npm run dev
```

Prueba en el navegador: `http://localhost:3000/api/health` → `{"estado":"OK"}`.

### Cuentas de prueba (contraseña de todas: `Talento2026!`)

| Rol | Correo |
| --- | --- |
| Candidata | `candidata@talentonova.bo` |
| Reclutador (Kantutani Tech) | `empresa@talentonova.bo` |
| Administrador | `admin@talentonova.bo` |

## 3. Publicar la API con una URL https

El celular **no** puede usar `localhost`. Elige una opción:

**Túnel de Cloudflare (para desarrollar y probar):** con la API corriendo, en otra terminal:

```bash
cloudflared tunnel --url http://localhost:3000
```

Copia la URL `https://…trycloudflare.com`. Cambia cada vez que reinicias el túnel.

**Render (para la entrega, URL fija):**
New → Web Service → repositorio `TalentoNova` →
**Root Directory:** `backend` · **Build:** `npm install` · **Start:** `npm start` · **Instance:** Free →
en **Environment** agrega `SUPABASE_URL`, `SUPABASE_SECRET_KEY` y `JWT_SECRET`.
El plan gratuito se "duerme" tras 15 minutos sin uso: abre la URL un minuto antes de presentar.

## 4. App móvil (Expo Go)

```bash
cd app
npm install
npx expo install @react-native-async-storage/async-storage react-native-safe-area-context @expo/vector-icons
npx expo install --fix
```

Crea `app/.env` (copia de `app/.env.example`) con la URL pública de la API:

```
EXPO_PUBLIC_API_URL=https://tu-tunel.trycloudflare.com
```

Arranca la app y escanea el código QR con **Expo Go** (SDK 58):

```bash
npx expo start
```

Si el celular no está en la misma red Wi-Fi que la computadora: `npx expo start --tunnel`.

> La URL de la API también se puede cambiar **dentro de la app**: en la pantalla de inicio de sesión,
> abajo, toca **Servidor → Cambiar**, pega la URL, toca **Probar** y **Guardar**.

## 5. Postman

Importa `backend/docs/TalentoNova.postman_collection.json`.
En las variables de la colección cambia `baseUrl` por tu URL. Ejecuta un **Login**: el token se guarda solo.

## 6. Trabajo en equipo

Ver **[GUIA_RAMAS.md](GUIA_RAMAS.md)**: reparto de módulos, ramas y Pull Requests para los 6 integrantes.

---

## Funcionalidades

**Candidato:** registro e ingreso · panel con avance del perfil y ofertas recomendadas según sus habilidades ·
buscador de ofertas con filtros · detalle y postulación · seguimiento de postulaciones con historial ·
perfil y currículum editables · habilidades con nivel · registro de títulos y certificados.

**Reclutador:** registro de empresa · panel con indicadores · publicar, editar, cerrar y eliminar vacantes
(borrador o publicada) · postulaciones recibidas por vacante y etapa · cambio de etapa con nota ·
buscador de talento por profesión y habilidad · perfil completo del candidato.

**Administrador:** indicadores de la plataforma · usuarios (filtrar, activar, suspender) ·
verificación de documentos (con motivo de rechazo) · verificación de empresas.

## Problemas comunes

| Mensaje | Solución |
| --- | --- |
| `No se pudo conectar con el servidor` (en la app) | La API no está corriendo o la URL es incorrecta. Revísala en **Servidor → Probar**. |
| `La base de datos no está actualizada` | Falta ejecutar `01_actualizacion.sql` en Supabase. |
| `Correo o contraseña incorrectos` con las cuentas demo | Falta ejecutar `npm run seed` en `backend/`. |
| `Project is incompatible with this version of Expo Go` | Actualiza Expo Go y ejecuta `npx expo install --fix` en `app/`. |
| `Faltan SUPABASE_URL o SUPABASE_SECRET_KEY` | El archivo `.env` no está dentro de `backend/` o tiene otros nombres. |
