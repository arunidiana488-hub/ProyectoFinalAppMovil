# API REST · TALENTO NOVA

Node.js 22 · Express 5 · Supabase. Formato de respuesta único:

```json
{ "success": true, "mensaje": "Texto opcional", "...datos": "..." }
{ "success": false, "mensaje": "Qué salió mal" }
```

Las rutas protegidas necesitan el encabezado `Authorization: Bearer <token>` (el token lo devuelve el login).

## Estructura

```
backend/
├── server.js                 → arranca el servidor
├── src/
│   ├── app.js                → registra los módulos (rutas)
│   ├── config/               → variables de entorno y cliente de Supabase
│   ├── middleware/           → sesión y roles (auth.js), errores (errorHandler.js)
│   ├── utils/                → validaciones, contraseñas, tokens, respuestas, errores de BD
│   ├── routes/               → un archivo de rutas por módulo
│   └── controllers/          → la lógica de cada módulo
├── database/                 → scripts SQL
├── scripts/seed.js           → datos de demostración
└── docs/                     → colección de Postman
```

## Endpoints

Roles: **C** candidato · **R** reclutador · **A** administrador · **—** público

### Autenticación · `feature/auth`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | — | Crear cuenta (`candidate` o `recruiter`) |
| POST | `/api/auth/login` | — | Iniciar sesión → `token` + `usuario` |
| GET | `/api/auth/me` | C R A | Datos de la sesión (incluye empresas del reclutador) |

### Perfil y currículum · `feature/profile-cv`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| GET | `/api/users?q=&skill=&role=&status=` | R A | Buscar candidatos / listar usuarios |
| GET | `/api/users/:id` | dueño R A | Perfil completo (CV, habilidades, documentos) |
| PUT | `/api/users/me` | C R A | Editar nombre, teléfono, foto |
| PATCH | `/api/users/:id/status` | A | Activar o suspender cuenta |
| GET | `/api/curriculums/me` | C R A | Mi currículum |
| PUT | `/api/curriculums/me` | C | Crear o actualizar mi currículum |
| GET | `/api/curriculums/user/:userId` | dueño R A | Currículum de un candidato |

### Empresas · `feature/companies`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| GET | `/api/companies?q=&verification_status=` | C R A | Listar empresas |
| GET | `/api/companies/mine` | R | Mis empresas |
| GET | `/api/companies/:id` | C R A | Ver una empresa |
| POST | `/api/companies` | R | Registrar empresa (queda pendiente) |
| PUT | `/api/companies/:id` | miembro A | Editar empresa |
| PATCH | `/api/companies/:id/verification` | A | Verificar / rechazar |

### Ofertas laborales · `feature/jobs-skills`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| GET | `/api/jobs?q=&work_modality=&employment_type=&city=&mine=true` | — | Listar (público: solo publicadas) |
| GET | `/api/jobs/:id` | — | Ver una oferta con su empresa |
| POST | `/api/jobs` | R A | Crear (solo para su empresa) |
| PUT | `/api/jobs/:id` | R A | Editar |
| DELETE | `/api/jobs/:id` | R A | Eliminar (409 si tiene postulaciones) |

### Habilidades · `feature/jobs-skills`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| GET | `/api/skills?user_id=` | C R A | Habilidades de un usuario (sin `user_id`: las mías) |
| GET | `/api/skills/:id` | C R A | Ver una |
| POST | `/api/skills` | C A | Agregar (`skill_name`, `level`, `category`) |
| PUT | `/api/skills/:id` | dueño A | Editar |
| DELETE | `/api/skills/:id` | dueño A | Eliminar |

### Postulaciones · `feature/applications`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| POST | `/api/applications` | C | Postular (`job_id`), sin duplicados |
| GET | `/api/applications/mine` | C | Mis postulaciones |
| GET | `/api/applications/received?job_id=&status=` | R A | Recibidas en mis vacantes |
| GET | `/api/applications/:id` | dueño R A | Detalle con historial |
| PATCH | `/api/applications/:id/status` | R A | Cambiar etapa (`status`, `note`) |
| DELETE | `/api/applications/:id` | C A | Retirar postulación |

### Documentos y administración · `feature/documents-admin`
| Método | Ruta | Rol | Descripción |
| --- | --- | --- | --- |
| GET | `/api/documents/mine` | C R A | Mis documentos |
| GET | `/api/documents?status=pending` | A | Todos los documentos |
| POST | `/api/documents` | C | Registrar título o certificado |
| DELETE | `/api/documents/:id` | dueño A | Eliminar (no verificados) |
| PATCH | `/api/documents/:id/review` | A | Verificar o rechazar (`status`, `rejection_reason`) |
| GET | `/api/admin/stats` | A | Indicadores del panel |

## Valores permitidos

| Campo | Valores |
| --- | --- |
| `role` | `candidate`, `recruiter`, `administrator` |
| `work_modality` | `remote`, `hybrid`, `onsite` |
| `employment_type` | `full_time`, `part_time`, `internship`, `freelance`, `temporary` |
| `publication_status` | `draft`, `published`, `closed` |
| `application_status` | `pending`, `reviewing`, `shortlisted`, `interview`, `hired`, `rejected` |
| `level` (habilidad) | `basic`, `intermediate`, `advanced` |
| `document_type` | `degree`, `technical_title`, `certificate`, `identity`, `other` |
| `verification_status` | `pending`, `verified`, `rejected` |

## Códigos de respuesta

`200` correcto · `201` creado · `400` dato inválido · `401` sin sesión · `403` sin permiso ·
`404` no existe · `409` duplicado o en uso · `500` error del servidor.

## Seguridad

- Las contraseñas se guardan cifradas con **scrypt** (nunca en texto plano).
- La sesión usa **JWT HS256** firmado con `JWT_SECRET`.
- La clave secreta de Supabase solo vive en el servidor. RLS está activado en todas las tablas,
  así que nadie puede leerlas directamente con la clave pública.
