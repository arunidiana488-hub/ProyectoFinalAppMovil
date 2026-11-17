import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './AppButton';
import { colors, radius, spacing, typography } from '../../theme';

// Cargando…
export function LoadingState({ message = 'Cargando…' }) {
    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

// Lista vacía o sin resultados
export function EmptyState({ icon = 'search-outline', title, message, actionLabel, onAction }) {
    return (
        <View style={styles.center}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={30} color={colors.primary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {!!message && <Text style={styles.message}>{message}</Text>}
            {!!actionLabel && <AppButton title={actionLabel} onPress={onAction} size="sm" style={styles.action} />}
        </View>
    );
}

// Error al cargar, con botón para reintentar
export function ErrorState({ message, onRetry }) {
    return (
        <View style={styles.center}>
            <View style={[styles.iconBox, styles.iconError]}>
                <Ionicons name="cloud-offline-outline" size={30} color={colors.danger} />
            </View>
            <Text style={styles.title}>No pudimos cargar la información</Text>
            <Text style={styles.message}>{message}</Text>
            {onRetry && <AppButton title="Reintentar" icon="refresh" onPress={onRetry} size="sm" variant="outline" style={styles.action} />}
        </View>
    );
}

const styles = StyleSheet.create({
    center: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl * 1.5, paddingHorizontal: spacing.xl },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: radius.xl,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg
    },
    iconError: { backgroundColor: colors.dangerSoft },
    title: { ...typography.h3, color: colors.text, textAlign: 'center' },
    message: { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
    action: { marginTop: spacing.lg }
});
