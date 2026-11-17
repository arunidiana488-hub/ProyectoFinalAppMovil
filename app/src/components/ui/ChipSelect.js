import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';

/**
 * Selector de opciones en forma de chips.
 *  options: [{ value, label }]
 *  allLabel: si se indica, agrega la opción "Todas" (valor '')
 *  scroll: chips en una fila desplazable; si es false, se acomodan en varias filas
 */
export default function ChipSelect({ label, options, value, onChange, allLabel, scroll = true, style }) {
    const lista = allLabel ? [{ value: '', label: allLabel }, ...options] : options;

    const chips = lista.map((opcion) => {
        const activo = (value ?? '') === opcion.value;
        return (
            <Pressable
                key={opcion.value || 'todas'}
                onPress={() => onChange(opcion.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: activo }}
                style={({ pressed }) => [styles.chip, activo && styles.chipActive, pressed && styles.pressed]}
            >
                <Text style={[styles.text, activo && styles.textActive]}>{opcion.label}</Text>
            </Pressable>
        );
    });

    return (
        <View style={[styles.wrapper, style]}>
            {!!label && <Text style={styles.label}>{label}</Text>}
            {scroll ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {chips}
                </ScrollView>
            ) : (
                <View style={[styles.row, styles.wrap]}>{chips}</View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: spacing.lg },
    label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.sm, paddingRight: spacing.sm },
    wrap: { flexWrap: 'wrap' },
    chip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: 9,
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border
    },
    chipActive: { backgroundColor: colors.midnight, borderColor: colors.midnight },
    text: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    textActive: { color: colors.white },
    pressed: { opacity: 0.75 }
});
