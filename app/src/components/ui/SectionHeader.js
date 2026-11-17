import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

// Título de sección con acción opcional a la derecha ("Ver todas")
export default function SectionHeader({ title, eyebrow, actionLabel, onAction, style }) {
    return (
        <View style={[styles.row, style]}>
            <View style={styles.texts}>
                {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
                <Text style={styles.title}>{title}</Text>
            </View>
            {!!actionLabel && (
                <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
                    <Text style={styles.action}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
        marginBottom: spacing.md
    },
    texts: { flex: 1 },
    eyebrow: { ...typography.overline, color: colors.textSecondary, marginBottom: 2 },
    title: { ...typography.h3, fontSize: 17, color: colors.text },
    action: { fontSize: 13, fontWeight: '700', color: colors.primary }
});
