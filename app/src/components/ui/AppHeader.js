import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../../theme';

// Encabezado de pantalla con botón "atrás" opcional y acción a la derecha
export default function AppHeader({ title, subtitle, eyebrow, onBack, right }) {
    return (
        <View style={styles.container}>
            {onBack && (
                <Pressable
                    onPress={onBack}
                    hitSlop={10}
                    style={({ pressed }) => [styles.back, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Volver"
                >
                    <Ionicons name="chevron-back" size={22} color={colors.text} />
                </Pressable>
            )}
            <View style={styles.texts}>
                {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
                <Text style={onBack ? styles.titleSmall : styles.title} numberOfLines={2}>{title}</Text>
                {!!subtitle && <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>}
            </View>
            {right ? <View style={styles.right}>{right}</View> : null}
        </View>
    );
}

// Botón redondo con ícono para la derecha del encabezado
export function HeaderIconButton({ icon, onPress, label, tone = 'default' }) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={label}
            style={({ pressed }) => [styles.iconButton, tone === 'primary' && styles.iconPrimary, pressed && styles.pressed]}
        >
            <Ionicons name={icon} size={20} color={tone === 'primary' ? colors.white : colors.text} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.md
    },
    back: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center'
    },
    texts: { flex: 1 },
    eyebrow: { ...typography.overline, color: colors.primary, marginBottom: 2 },
    title: { ...typography.h1, color: colors.text },
    titleSmall: { ...typography.h2, color: colors.text },
    subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
    right: { flexDirection: 'row', gap: spacing.sm },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
    pressed: { opacity: 0.7 }
});
