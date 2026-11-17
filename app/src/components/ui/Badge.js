import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { radius, spacing, tones } from '../../theme';

// Etiqueta pequeña de estado. tone: primary | turquoise | violet | success | warning | danger | neutral
export default function Badge({ label, tone = 'neutral', icon, style }) {
    const t = tones[tone] || tones.neutral;
    return (
        <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
            {icon && <Ionicons name={icon} size={12} color={t.fg} />}
            <Text style={[styles.text, { color: t.fg }]} numberOfLines={1}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 4,
        borderRadius: radius.pill
    },
    text: { fontSize: 12, fontWeight: '700' }
});
