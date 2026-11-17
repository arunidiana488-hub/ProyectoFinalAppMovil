import Badge from '../ui/Badge';
import { APPLICATION_STATUS, optionOf } from '../../constants/options';

// Etapa de una postulación: Recibida, En revisión, Entrevista…
export default function ApplicationStatusBadge({ status }) {
    const opcion = optionOf(APPLICATION_STATUS, status) || APPLICATION_STATUS[0];
    return <Badge label={opcion.label} tone={opcion.tone} icon={opcion.icon} />;
}
