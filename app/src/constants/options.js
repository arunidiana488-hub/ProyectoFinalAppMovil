// Valores que guarda la API (en inglés) y cómo se muestran en la app (en español).
// Deben coincidir con backend/src/utils/constants.js

export const ROLES = [
    { value: 'candidate', label: 'Candidato' },
    { value: 'recruiter', label: 'Reclutador' },
    { value: 'administrator', label: 'Administrador' }
];

export const WORK_MODALITIES = [
    { value: 'remote', label: 'Remoto' },
    { value: 'hybrid', label: 'Híbrido' },
    { value: 'onsite', label: 'Presencial' }
];

export const EMPLOYMENT_TYPES = [
    { value: 'full_time', label: 'Tiempo completo' },
    { value: 'part_time', label: 'Medio tiempo' },
    { value: 'internship', label: 'Pasantía' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'temporary', label: 'Temporal' }
];

export const PUBLICATION_STATUS = [
    { value: 'published', label: 'Publicada', tone: 'success' },
    { value: 'draft', label: 'Borrador', tone: 'warning' },
    { value: 'closed', label: 'Cerrada', tone: 'neutral' }
];

export const APPLICATION_STATUS = [
    { value: 'pending', label: 'Recibida', tone: 'primary', icon: 'paper-plane-outline' },
    { value: 'reviewing', label: 'En revisión', tone: 'violet', icon: 'eye-outline' },
    { value: 'shortlisted', label: 'Preseleccionada', tone: 'turquoise', icon: 'star-outline' },
    { value: 'interview', label: 'Entrevista', tone: 'primary', icon: 'chatbubbles-outline' },
    { value: 'hired', label: 'Seleccionada', tone: 'success', icon: 'checkmark-circle-outline' },
    { value: 'rejected', label: 'No seleccionada', tone: 'danger', icon: 'close-circle-outline' }
];

// Estados en los que el proceso sigue abierto
export const ACTIVE_APPLICATION_STATUS = ['pending', 'reviewing', 'shortlisted', 'interview'];

export const SKILL_LEVELS = [
    { value: 'basic', label: 'Básico', step: 1 },
    { value: 'intermediate', label: 'Intermedio', step: 2 },
    { value: 'advanced', label: 'Avanzado', step: 3 }
];

export const SKILL_CATEGORIES = ['Programación', 'Diseño', 'Base de datos', 'Análisis', 'Marketing', 'Idiomas', 'Habilidad blanda'];

export const DOCUMENT_TYPES = [
    { value: 'degree', label: 'Título académico', icon: 'school-outline' },
    { value: 'technical_title', label: 'Título técnico', icon: 'construct-outline' },
    { value: 'certificate', label: 'Certificado', icon: 'ribbon-outline' },
    { value: 'identity', label: 'Documento de identidad', icon: 'id-card-outline' },
    { value: 'other', label: 'Otro', icon: 'document-outline' }
];

export const VERIFICATION_STATUS = [
    { value: 'pending', label: 'Pendiente', tone: 'warning' },
    { value: 'verified', label: 'Verificado', tone: 'success' },
    { value: 'rejected', label: 'Rechazado', tone: 'danger' }
];

export const ACCOUNT_STATUS = [
    { value: 'active', label: 'Activa', tone: 'success' },
    { value: 'suspended', label: 'Suspendida', tone: 'danger' }
];

export const CURRENCIES = [
    { value: 'BOB', label: 'Bolivianos (Bs)' },
    { value: 'USD', label: 'Dólares ($us)' }
];

// Busca la opción de una lista por su valor
export const optionOf = (lista, valor) => lista.find((o) => o.value === valor);

// Texto en español de un valor; si no existe, devuelve el valor o el texto por defecto
export const labelOf = (lista, valor, porDefecto = '—') => optionOf(lista, valor)?.label || valor || porDefecto;
