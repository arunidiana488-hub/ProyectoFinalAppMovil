import { useEffect, useState } from 'react';

import BottomSheet from '../ui/BottomSheet';
import TextField from '../ui/TextField';
import ChipSelect from '../ui/ChipSelect';
import AppButton from '../ui/AppButton';
import { SKILL_CATEGORIES, SKILL_LEVELS } from '../../constants/options';

const CATEGORIAS = SKILL_CATEGORIES.map((c) => ({ value: c, label: c }));

/**
 * Panel para agregar o editar una habilidad.
 * skill: habilidad a editar (o null para crear una nueva)
 */
export default function SkillForm({ visible, skill, onClose, onSubmit, submitting }) {
    const [nombre, setNombre] = useState('');
    const [nivel, setNivel] = useState('intermediate');
    const [categoria, setCategoria] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (visible) {
            setNombre(skill?.skill_name || '');
            setNivel(skill?.level || 'intermediate');
            setCategoria(skill?.category || '');
            setError('');
        }
    }, [visible, skill]);

    const guardar = () => {
        if (nombre.trim().length < 2) {
            setError('Escribe el nombre de la habilidad');
            return;
        }
        onSubmit({ skill_name: nombre.trim(), level: nivel, category: categoria || null });
    };

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title={skill ? 'Editar habilidad' : 'Nueva habilidad'}
            subtitle="Las empresas buscan candidatos por estas habilidades"
            footer={<AppButton title={skill ? 'Guardar cambios' : 'Agregar habilidad'} onPress={guardar} loading={submitting} full />}
        >
            <TextField
                label="Habilidad"
                required
                value={nombre}
                onChangeText={(t) => {
                    setNombre(t);
                    setError('');
                }}
                placeholder="Ej. React Native, Liderazgo, SQL"
                error={error}
                maxLength={60}
            />
            <ChipSelect label="Nivel" options={SKILL_LEVELS} value={nivel} onChange={setNivel} scroll={false} />
            <ChipSelect label="Categoría" options={CATEGORIAS} allLabel="Sin categoría" value={categoria} onChange={setCategoria} scroll={false} />
        </BottomSheet>
    );
}
