import { StyleSheet, Text, View } from 'react-native';

import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import AppButton from '../ui/AppButton';
import { colors, spacing } from '../../theme';
import { ACCOUNT_STATUS, ROLES, labelOf, optionOf } from '../../constants/options';
import { formatDate } from '../../utils/format';

// Fila de usuario para el panel del administrador, con activar / suspender
export default function UserRow({ user, onPress, onToggle, isSelf = false, loading = false }) {
    const estado = optionOf(ACCOUNT_STATUS, user.account_status) || ACCOUNT_STATUS[0];
    const activo = user.account_status === 'active';

    return (
        <Card onPress={onPress}>
            <View style={styles.row}>
                <Avatar name={user.full_name} uri={user.profile_photo} size={44} />
                <View style={styles.texts}>
                    <Text style={styles.name} numberOfLines={1}>{user.full_name}</Text>
                    <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.badges}>
                    <Badge label={labelOf(ROLES, user.role)} tone="primary" />
                    <Badge label={estado.label} tone={estado.tone} />
                </View>
                {!isSelf && onToggle && (
                    <AppButton
                        title={activo ? 'Suspender' : 'Activar'}
                        variant={activo ? 'danger' : 'secondary'}
                        size="sm"
                        loading={loading}
                        onPress={() => onToggle(user)}
                    />
                )}
            </View>
            <Text style={styles.meta}>Registrado el {formatDate(user.created_at)}</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    texts: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: colors.text },
    email: { fontSize: 13, color: colors.textSecondary, marginTop: 1 },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
    badges: { flexDirection: 'row', gap: spacing.sm, flexShrink: 1, flexWrap: 'wrap' },
    meta: { fontSize: 12, color: colors.textMuted, marginTop: spacing.sm }
});
