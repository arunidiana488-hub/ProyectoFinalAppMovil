import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../../theme';

const VARIANTES = {
    primary: { bg: colors.primary, fg: colors.white, border: colors.primary },
    dark: { bg: colors.midnight, fg: colors.white, border: colors.midnight },
    secondary: { bg: colors.primarySoft, fg: colors.primary, border: colors.primarySoft },
    outline: { bg: colors.surface, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.dangerSoft },
    light: { bg: colors.white, fg: colors.midnight, border: colors.white }
};

// Botón principal de la app. variant: primary | dark | secondary | outline | ghost | danger | light
export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    icon,
    iconRight,
    loading = false,
    disabled = false,
    size = 'md',
    full = false,
    style
}) {
    const v = VARIANTES[variant] || VARIANTES.primary;
    const inactivo = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={inactivo}
            accessibilityRole="button"
            accessibilityState={{ disabled: inactivo, busy: loading }}
            style={({ pressed }) => [
                styles.base,
                size === 'sm' ? styles.sm : styles.md,
                { backgroundColor: v.bg, borderColor: v.border },
                full && styles.full,
                inactivo && styles.disabled,
                pressed && !inactivo && styles.pressed,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={v.fg} />
            ) : (
                <View style={styles.content}>
                    {icon && <Ionicons name={icon} size={size === 'sm' ? 16 : 18} color={v.fg} />}
                    <Text style={[styles.text, size === 'sm' && styles.textSm, { color: v.fg }]} numberOfLines={1}>
                        {title}
                    </Text>
                    {iconRight && <Ionicons name={iconRight} size={size === 'sm' ? 16 : 18} color={v.fg} />}
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: radius.md,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    md: { minHeight: 50, paddingHorizontal: spacing.xl },
    sm: { minHeight: 38, paddingHorizontal: spacing.md },
    full: { alignSelf: 'stretch' },
    content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    text: { fontSize: 15, fontWeight: '700' },
    textSm: { fontSize: 13 },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] }
});
