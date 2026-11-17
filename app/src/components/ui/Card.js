import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, shadow, spacing } from '../../theme';

// Tarjeta blanca con borde suave. Si recibe onPress, se puede tocar.
export default function Card({ children, onPress, style, padded = true }) {
    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                style={({ pressed }) => [styles.card, padded && styles.padded, pressed && styles.pressed, style]}
            >
                {children}
            </Pressable>
        );
    }
    return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        ...shadow.card
    },
    padded: { padding: spacing.lg },
    pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] }
});
