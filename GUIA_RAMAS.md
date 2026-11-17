# Guía de trabajo por ramas · TALENTO NOVA (6 integrantes)

El repositorio queda con dos carpetas: `backend/` (API) y `app/` (Expo). Cada módulo es una rama
que trae **su parte del backend y su parte de la app**.

## Reparto

| Integrante | Rama | Módulo | Backend | App |
| --- | --- | --- | --- | --- |
| Base (Integrante 1) | `feature/base` | Estructura y componentes comunes | config, middleware, utils, SQL, seed, Postman | tema, componentes UI, navegación, sesión |
| 1 | `feature/jobs-skills` | Ofertas laborales y habilidades | `/api/jobs`, `/api/skills` | Buscador, detalle, publicar vacante, habilidades |
| 2 | `feature/auth` | Login, registro, roles y paneles de inicio | `/api/auth` | Login, registro, inicio del candidato y de la empresa |
| 3 | `feature/profile-cv` | Perfil, currículum y talento | `/api/users`, `/api/curriculums` | Perfil, editar CV, buscador de talento |
| 4 | `feature/companies` | Empresas | `/api/companies` | Mi empresa, verificación de empresas |
| 5 | `feature/applications` | Postulaciones | `/api/applications` | Mis postulaciones, recibidas, historial |
| 6 | `feature/documents-admin` | Documentos y administración | `/api/documents`, `/api/admin` | Títulos, panel admin, usuarios, revisión |

**Orden:** primero se une `feature/base` a `develop`. Después, las 6 ramas de módulos (en cualquier orden).
Al final, `develop` → `main`. La app y la API funcionan completas cuando las 7 ramas están unidas.

> Para probar todo **antes** de unir las ramas, ejecuta directamente la carpeta descomprimida del .zip.

---

## Paso 0 · Limpiar lo anterior (una sola vez)

1. En GitHub, cierra el Pull Request #1 (**Close pull request**): usaba la estructura vieja.
   Su código ya está incluido y mejorado en `feature/jobs-skills`.
2. Descomprime `TalentoNova_completo.zip`, por ejemplo en `C:\Users\ASUS\Downloads\TalentoNova`.

## Paso 1 · Rama base (Integrante 1)

En la terminal de VS Code, dentro de la carpeta del repositorio (`CURRICULUM_VITAE`):

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/base

# Quitar la estructura vieja de la raíz (ahora vive en backend/)
git rm -r --ignore-unmatch src server.js package.json package-lock.json

# Copiar TODO el proyecto nuevo (cambia la ruta si lo descomprimiste en otro lugar)
$ZIP = "C:\Users\ASUS\Downloads\TalentoNova"
Copy-Item -Recurse -Force "$ZIP\backend", "$ZIP\app" .
Copy-Item -Force "$ZIP\README.md", "$ZIP\GUIA_RAMAS.md", "$ZIP\.gitignore" .

# Mover tu .env al backend (luego agrégale JWT_SECRET, ver README)
if (Test-Path .env) { Move-Item -Force .env backend\.env }
```

Ahora todos los archivos están en tu carpeta, pero **cada rama sube solo los suyos**. La base sube:

```powershell
git add README.md GUIA_RAMAS.md .gitignore
git add backend/package.json backend/server.js backend/.env.example backend/.gitignore backend/README.md
git add backend/src/app.js backend/src/config backend/src/middleware backend/src/utils
git add backend/database backend/scripts backend/docs
git add app/package.json app/app.json app/index.js app/App.js app/.env.example app/.gitignore app/README.md
git add app/src/config app/src/theme app/src/constants app/src/utils app/src/hooks app/src/context app/src/navigation
git add app/src/services/api.js app/src/components/ui
git status
git commit -m "feat: estructura base del backend y la app (componentes, tema, navegación)"
git push -u origin feature/base
```

En GitHub: **Pull request** de `feature/base` → `develop` → **Merge**.

> `git status` debe mostrar en verde solo los archivos de la base. Los demás quedan en rojo
> ("untracked"): es correcto, los sube cada rama.

---

## Paso 2 · Ramas de módulos

Cada rama sale de `develop` **ya actualizado** con la base:

```powershell
git checkout develop
git pull origin develop
git checkout -b NOMBRE-DE-LA-RAMA
# ...git add de los archivos del módulo (abajo)...
git commit -m "MENSAJE"
git push -u origin NOMBRE-DE-LA-RAMA
```

Luego, en GitHub: **Pull request** → base `develop` → otro integrante lo revisa → **Merge**.

**Si cada integrante sube su propia rama** (recomendado): clona el repositorio, copia la carpeta
descomprimida del .zip dentro (igual que en el Paso 1, sin el `git rm`) y ejecuta solo los
`git add` de su módulo.

### Integrante 1 · `feature/jobs-skills`

```powershell
git add backend/src/routes/jobs.routes.js backend/src/controllers/jobs.controller.js
git add backend/src/routes/skills.routes.js backend/src/controllers/skills.controller.js
git add app/src/services/jobs.service.js app/src/services/skills.service.js
git add app/src/components/jobs app/src/components/skills
git add app/src/screens/candidate/JobsScreen.js app/src/screens/candidate/SkillsScreen.js
git add app/src/screens/shared/JobDetailScreen.js
git add app/src/screens/recruiter/MyJobsScreen.js app/src/screens/recruiter/JobFormScreen.js
git commit -m "feat: ofertas laborales y habilidades (API + pantallas)"
```

### Integrante 2 · `feature/auth`

```powershell
git add backend/src/routes/auth.routes.js backend/src/controllers/auth.controller.js
git add app/src/services/auth.service.js app/src/components/auth app/src/screens/auth
git add app/src/screens/candidate/CandidateHomeScreen.js app/src/screens/recruiter/RecruiterHomeScreen.js
git commit -m "feat: login, registro, roles y paneles de inicio"
```

### Integrante 3 · `feature/profile-cv`

```powershell
git add backend/src/routes/users.routes.js backend/src/controllers/users.controller.js
git add backend/src/routes/curriculums.routes.js backend/src/controllers/curriculums.controller.js
git add app/src/services/users.service.js app/src/components/profile
git add app/src/screens/candidate/ProfileScreen.js app/src/screens/candidate/EditProfileScreen.js
git add app/src/screens/shared/CandidateProfileScreen.js app/src/screens/recruiter/CandidatesScreen.js
git commit -m "feat: perfil, currículum y buscador de talento"
```

### Integrante 4 · `feature/companies`

```powershell
git add backend/src/routes/companies.routes.js backend/src/controllers/companies.controller.js
git add app/src/services/companies.service.js app/src/components/companies
git add app/src/screens/recruiter/CompanyScreen.js app/src/screens/admin/CompaniesScreen.js
git commit -m "feat: registro y verificación de empresas"
```

### Integrante 5 · `feature/applications`

```powershell
git add backend/src/routes/applications.routes.js backend/src/controllers/applications.controller.js
git add app/src/services/applications.service.js app/src/components/applications
git add app/src/screens/candidate/MyApplicationsScreen.js app/src/screens/shared/ApplicationDetailScreen.js
git add app/src/screens/recruiter/ReceivedApplicationsScreen.js
git commit -m "feat: postulaciones con etapas e historial"
```

### Integrante 6 · `feature/documents-admin`

```powershell
git add backend/src/routes/documents.routes.js backend/src/controllers/documents.controller.js
git add backend/src/routes/admin.routes.js backend/src/controllers/admin.controller.js
git add app/src/services/documents.service.js app/src/services/admin.service.js
git add app/src/components/documents app/src/components/admin
git add app/src/screens/candidate/DocumentsScreen.js
git add app/src/screens/admin/AdminHomeScreen.js app/src/screens/admin/UsersScreen.js app/src/screens/admin/DocumentsReviewScreen.js
git commit -m "feat: documentos, verificación y panel de administración"
```

---

## Paso 3 · Cierre

Cuando las 7 ramas estén unidas en `develop`:

```powershell
git checkout develop
git pull origin develop
git status          # no debe quedar ningún archivo en rojo
```

En GitHub: **Pull request** de `develop` → `main` → **Merge**. Esa es la versión de entrega
(la que se publica en Render).

## Qué debe saber explicar cada integrante

1. **La ruta** (`backend/src/routes/...`): qué método y dirección atiende y qué rol puede usarla.
2. **El controlador** (`backend/src/controllers/...`): qué valida y qué consulta hace a Supabase.
3. **El servicio de la app** (`app/src/services/...`): cómo la app llama a esa API.
4. **La pantalla** (`app/src/screens/...`) y **sus componentes** (`app/src/components/...`).
5. **Una prueba en Postman** de su módulo (carpeta con el nombre de su rama en la colección).

## Reglas del equipo

- Nunca subir `.env` ni `node_modules` (ya están en `.gitignore`).
- Una rama = un módulo = un Pull Request hacia `develop`.
- Mensajes de commit: `feat:` (nuevo), `fix:` (corrección), `docs:` (documentación).
- Antes del Pull Request: `git pull origin develop` y volver a probar.
