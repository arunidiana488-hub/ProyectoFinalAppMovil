import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadow, spacing, tones } from '../../theme';

// Indicador numérico del panel (ej. "Postulaciones activas: 3")
export default function StatCard({ icon, label, value, detail, tone = 'primary', onPress, style }) {
    const t = tones[tone] || tones.primary;
    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [styles.card, pressed && onPress && styles.pressed, style]}
        >
            <View style={[styles.icon, { backgroundColor: t.bg }]}>
                <Ionicons name={icon} size={20} color={t.fg} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label} numberOfLines={2}>{label}</Text>
            {!!detail && <Text style={[styles.detail, { color: t.fg }]} numberOfLines={1}>{detail}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        ...shadow.card
    },
    icon: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md
    },
    value: { fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    label: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    detail: { fontSize: 12, fontWeight: '600', marginTop: spacing.xs },
    pressed: { opacity: 0.85 }
});
