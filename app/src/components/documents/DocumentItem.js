import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { colors, radius, spacing } from '../../theme';
import { DOCUMENT_TYPES, VERIFICATION_STATUS, optionOf } from '../../constants/options';
import { formatDate } from '../../utils/format';

// Un título o certificado con su estado de verificación. `children` permite agregar acciones.
export default function DocumentItem({ document, showOwner = false, children }) {
    const tipo = optionOf(DOCUMENT_TYPES, document.document_type) || DOCUMENT_TYPES[4];
    const estado = optionOf(VERIFICATION_STATUS, document.verification_status) || VERIFICATION_STATUS[0];

    return (
        <Card>
            <View style={styles.row}>
                <View style={styles.icon}>
                    <Ionicons name={tipo.icon} size={22} color={colors.violet} />
                </View>
                <View style={styles.texts}>
                    <Text style={styles.name} numberOfLines={2}>{document.file_name}</Text>
                    <Text style={styles.meta}>
                        {tipo.label} · {formatDate(document.upload_date)}
                    </Text>
                    {showOwner && !!document.owner && (
                        <Text style={styles.owner}>
                            <Ionicons name="person-outline" size={12} color={colors.primary} /> {document.owner.full_name}
                        </Text>
                    )}
                </View>
                <Badge label={estado.label} tone={estado.tone} />
            </View>
            {document.verification_status === 'rejected' && !!document.rejection_reason && (
                <View style={styles.reason}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.danger} />
                    <Text style={styles.reasonText}>{document.rejection_reason}</Text>
                </View>
            )}
            {children}
        </Card>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    icon: {
        width: 44,
        height: 44,
        borderRadius: radius.md,
        backgroundColor: colors.violetSoft,
        alignItems: 'center',
        justifyContent: 'center'
    },
    texts: { flex: 1 },
    name: { fontSize: 14, fontWeight: '700', color: colors.text },
    meta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    owner: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 },
    reason: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.dangerSoft
    },
    reasonText: { flex: 1, fontSize: 13, color: colors.danger }
});
