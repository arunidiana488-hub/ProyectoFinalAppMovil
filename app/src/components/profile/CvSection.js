import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../ui/Card';
import { colors, radius, spacing } from '../../theme';

// Sección del currículum (Resumen, Experiencia, Estudios…). Cada línea del texto es un ítem.
export default function CvSection({ icon, title, content, emptyText = 'Sin información todavía' }) {
    const lineas = String(content || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

    return (
        <Card>
            <View style={styles.header}>
                <View style={styles.icon}>
                    <Ionicons name={icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            {lineas.length === 0 ? (
                <Text style={styles.empty}>{emptyText}</Text>
            ) : lineas.length === 1 ? (
                <Text style={styles.text}>{lineas[0]}</Text>
            ) : (
                lineas.map((linea, i) => (
                    <View key={i} style={styles.item}>
                        <View style={styles.dot} />
                        <Text style={[styles.text, styles.flex]}>{linea}</Text>
                    </View>
                ))
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
    icon: {
        width: 34,
        height: 34,
        borderRadius: radius.sm,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: { fontSize: 16, fontWeight: '800', color: colors.text },
    text: { fontSize: 14, lineHeight: 21, color: colors.text },
    empty: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic' },
    item: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.turquoise, marginTop: 8 },
    flex: { flex: 1 }
});
