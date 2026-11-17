import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BottomSheet from '../ui/BottomSheet';
import TextField from '../ui/TextField';
import AppButton from '../ui/AppButton';
import { colors, radius, spacing, tones } from '../../theme';
import { APPLICATION_STATUS } from '../../constants/options';

// Panel del reclutador para mover una postulación a otra etapa, con nota opcional
export default function StatusSelector({ visible, current, onClose, onSubmit, submitting }) {
    const [elegido, setElegido] = useState(current);
    const [nota, setNota] = useState('');

    useEffect(() => {
        if (visible) {
            setElegido(current);
            setNota('');
        }
    }, [visible, current]);

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Cambiar etapa"
            subtitle="El candidato verá el cambio en su lista de postulaciones"
            footer={
                <AppButton
                    title="Guardar etapa"
                    onPress={() => onSubmit(elegido, nota.trim() || null)}
                    loading={submitting}
                    disabled={!elegido || elegido === current}
                    full
                />
            }
        >
            {APPLICATION_STATUS.map((opcion) => {
                const activo = elegido === opcion.value;
                const t = tones[opcion.tone] || tones.primary;
                return (
                    <Pressable
                        key={opcion.value}
                        onPress={() => setElegido(opcion.value)}
                        style={[styles.option, activo && { borderColor: t.fg, backgroundColor: t.bg }]}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: activo }}
                    >
                        <Ionicons name={opcion.icon} size={20} color={t.fg} />
                        <Text style={styles.label}>{opcion.label}</Text>
                        {opcion.value === current && <Text style={styles.current}>Actual</Text>}
                        <Ionicons
                            name={activo ? 'radio-button-on' : 'radio-button-off'}
                            size={20}
                            color={activo ? t.fg : colors.textMuted}
                        />
                    </Pressable>
                );
            })}
            <TextField
                label="Nota para el historial (opcional)"
                value={nota}
                onChangeText={setNota}
                placeholder="Ej. Entrevista el lunes a las 10:00"
                style={styles.note}
            />
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm
    },
    label: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
    current: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
    note: { marginTop: spacing.md }
});
