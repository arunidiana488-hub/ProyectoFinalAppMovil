import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, tones } from '../../theme';
import { APPLICATION_STATUS, optionOf } from '../../constants/options';
import { formatDateTime } from '../../utils/format';

// Historial de etapas de una postulación, del más antiguo al más reciente
export default function StatusTimeline({ history = [] }) {
    if (!history.length) {
        return <Text style={styles.empty}>Todavía no hay movimientos registrados.</Text>;
    }

    return (
        <View>
            {history.map((paso, index) => {
                const opcion = optionOf(APPLICATION_STATUS, paso.status) || APPLICATION_STATUS[0];
                const t = tones[opcion.tone] || tones.primary;
                const ultimo = index === history.length - 1;
                return (
                    <View key={paso.id || index} style={styles.item}>
                        <View style={styles.rail}>
                            <View style={[styles.dot, { backgroundColor: t.bg, borderColor: t.fg }]}>
                                <Ionicons name={opcion.icon} size={14} color={t.fg} />
                            </View>
                            {!ultimo && <View style={styles.line} />}
                        </View>
                        <View style={[styles.content, !ultimo && styles.contentSpacing]}>
                            <Text style={[styles.status, ultimo && { color: t.fg }]}>{opcion.label}</Text>
                            {!!paso.note && <Text style={styles.note}>{paso.note}</Text>}
                            <Text style={styles.date}>{formatDateTime(paso.created_at)}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    item: { flexDirection: 'row', gap: spacing.md },
    rail: { alignItems: 'center', width: 30 },
    dot: {
        width: 30,
        height: 30,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
    content: { flex: 1, paddingTop: 4 },
    contentSpacing: { paddingBottom: spacing.lg },
    status: { fontSize: 15, fontWeight: '700', color: colors.text },
    note: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    date: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    empty: { fontSize: 13, color: colors.textSecondary }
});
