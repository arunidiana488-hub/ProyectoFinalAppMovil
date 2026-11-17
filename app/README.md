# App móvil · TALENTO NOVA

Expo SDK 58 · React Native 0.88 · JavaScript. Funciona en **Expo Go**.

## Instalar y ejecutar

```bash
npm install
npx expo install @react-native-async-storage/async-storage react-native-safe-area-context @expo/vector-icons
npx expo install --fix
npx expo start
```

Crea `.env` (copia de `.env.example`) con `EXPO_PUBLIC_API_URL=https://…` (la URL pública de la API).
También se puede cambiar dentro de la app: **Inicio de sesión → Servidor → Cambiar**.

## Estructura por componentes

```
app/
├── App.js                     → proveedores (zona segura, mensajes, sesión) + navegación
├── src/
│   ├── config/env.js          → URL de la API y cuentas de prueba
│   ├── theme/                 → colores, espaciados, tipografía y sombras de Talento Nova
│   ├── constants/options.js   → valores de la API y su texto en español
│   ├── utils/                 → formato de fechas y salarios, validaciones
│   ├── services/              → UN archivo por API (api.js es el cliente HTTP común)
│   ├── context/               → AuthContext (sesión) y ToastContext (mensajes)
│   ├── hooks/useApi.js        → carga de datos con estados de carga, error y actualización
│   ├── navigation/            → pestañas por rol (tabs.js) y pantallas apiladas (routes.js)
│   ├── components/
│   │   ├── ui/                → componentes base: Button, TextField, Card, Badge, Avatar…
│   │   ├── jobs/              → JobCard, JobFilters, JobForm, JobStatusBadge
│   │   ├── skills/            → SkillItem, SkillForm, LevelIndicator
│   │   ├── applications/      → ApplicationCard, StatusTimeline, StatusSelector…
│   │   ├── profile/           → ProfileHeader, CvSection, CompletenessCard
│   │   ├── companies/         → CompanyCard, CompanyForm
│   │   ├── documents/         → DocumentItem, DocumentForm
│   │   ├── admin/             → UserRow
│   │   └── auth/              → ServerSettingsSheet
│   └── screens/
│       ├── auth/              → Login, Registro
│       ├── candidate/         → Inicio, Ofertas, Postulaciones, Perfil, Editar perfil, Habilidades, Documentos
│       ├── recruiter/         → Inicio, Vacantes, Formulario de vacante, Postulaciones, Talento, Empresa
│       ├── admin/             → Resumen, Usuarios, Documentos, Empresas
│       └── shared/            → Detalle de oferta, Detalle de postulación, Perfil de candidato
```

**Regla:** una pantalla nunca llama a `fetch` directamente; usa su servicio (`services/*.service.js`),
y los elementos visuales repetidos viven en `components/`.

## Navegación

- `useNavigation().navigate('JobDetail', { id })` abre una pantalla encima.
- `goBack()` vuelve (también el botón Atrás de Android).
- `goToTab(1)` cambia de pestaña.
- Las pestañas de cada rol están en `src/navigation/tabs.js`.
