import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { SKILL_LEVELS, optionOf } from '../../constants/options';

// Nivel de una habilidad en 3 pasos: Básico ▮▯▯ · Intermedio ▮▮▯ · Avanzado ▮▮▮
export default function LevelIndicator({ level, showLabel = true }) {
    const opcion = optionOf(SKILL_LEVELS, level) || SKILL_LEVELS[0];
    return (
        <View style={styles.row}>
            <View style={styles.bars}>
                {[1, 2, 3].map((paso) => (
                    <View key={paso} style={[styles.bar, paso <= opcion.step && styles.barOn]} />
                ))}
            </View>
            {showLabel && <Text style={styles.label}>{opcion.label}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    bars: { flexDirection: 'row', gap: 3 },
    bar: { width: 16, height: 6, borderRadius: radius.pill, backgroundColor: colors.border },
    barOn: { backgroundColor: colors.turquoise },
    label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary }
});
