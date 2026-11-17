import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Avatar from '../ui/Avatar';
import { colors, radius, spacing } from '../../theme';

// Cabecera oscura del perfil con foto, nombre, profesión y contacto
export default function ProfileHeader({ user, title, children }) {
    return (
        <View style={styles.card}>
            <View style={styles.glow} />
            <View style={styles.row}>
                <Avatar name={user?.full_name} uri={user?.profile_photo} size={72} />
                <View style={styles.texts}>
                    <Text style={styles.name}>{user?.full_name}</Text>
                    <Text style={styles.title}>{title || 'Completa tu título profesional'}</Text>
                </View>
            </View>
            <View style={styles.contact}>
                {!!user?.email && (
                    <View style={styles.contactItem}>
                        <Ionicons name="mail-outline" size={15} color={colors.turquoise} />
                        <Text style={styles.contactText} numberOfLines={1}>{user.email}</Text>
                    </View>
                )}
                {!!user?.phone && (
                    <View style={styles.contactItem}>
                        <Ionicons name="call-outline" size={15} color={colors.turquoise} />
                        <Text style={styles.contactText}>{user.phone}</Text>
                    </View>
                )}
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.midnight,
        borderRadius: radius.xl,
        padding: spacing.xl,
        overflow: 'hidden',
        marginBottom: spacing.lg
    },
    glow: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: colors.primary,
        opacity: 0.35,
        right: -80,
        top: -90
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
    texts: { flex: 1 },
    name: { fontSize: 22, fontWeight: '800', color: colors.white, letterSpacing: -0.3 },
    title: { fontSize: 14, color: '#C9D3F5', marginTop: 4 },
    contact: { marginTop: spacing.lg, gap: spacing.sm },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    contactText: { fontSize: 13, color: colors.white, flexShrink: 1 }
});
