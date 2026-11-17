import Badge from '../ui/Badge';
import { PUBLICATION_STATUS, optionOf } from '../../constants/options';

// Estado de publicación de una oferta: Publicada / Borrador / Cerrada
export default function JobStatusBadge({ status }) {
    const opcion = optionOf(PUBLICATION_STATUS, status) || PUBLICATION_STATUS[1];
    return <Badge label={opcion.label} tone={opcion.tone} />;
}
