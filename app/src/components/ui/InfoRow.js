import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../../theme';

// Fila con ícono, etiqueta y valor (ej. "Ubicación · La Paz")
export default function InfoRow({ icon, label, value, last = false }) {
    return (
        <View style={[styles.row, !last && styles.border]}>
            <View style={styles.icon}>
                <Ionicons name={icon} size={17} color={colors.primary} />
            </View>
            <View style={styles.texts}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || '—'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
    border: { borderBottomWidth: 1, borderBottomColor: colors.border },
    icon: {
        width: 34,
        height: 34,
        borderRadius: radius.sm,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center'
    },
    texts: { flex: 1 },
    label: { fontSize: 12, color: colors.textSecondary },
    value: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 1 }
});
