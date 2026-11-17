import ChipSelect from '../ui/ChipSelect';
import { EMPLOYMENT_TYPES, WORK_MODALITIES } from '../../constants/options';

// Filtros del buscador de ofertas: modalidad y tipo de empleo
export default function JobFilters({ filters, onChange }) {
    return (
        <>
            <ChipSelect
                options={WORK_MODALITIES}
                allLabel="Todas las modalidades"
                value={filters.work_modality}
                onChange={(valor) => onChange({ ...filters, work_modality: valor })}
                style={{ marginBottom: 8 }}
            />
            <ChipSelect
                options={EMPLOYMENT_TYPES}
                allLabel="Todo tipo de empleo"
                value={filters.employment_type}
                onChange={(valor) => onChange({ ...filters, employment_type: valor })}
            />
        </>
    );
}
