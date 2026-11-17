import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader, Card, ErrorState, HeaderIconButton, LoadingState, Screen, SectionHeader, StatCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/admin.service';
import { colors, radius, spacing } from '../../theme';
import { todayLabel } from '../../utils/format';

// Centro de control del administrador (GET /api/admin/stats)
export default function AdminHomeScreen() {
    const { logout } = useAuth();
    const { goToTab } = useNavigation();
    const { data: s, loading, error, refreshing, refresh, reload } = useApi(() => adminService.stats());

    const salir = () =>
        Alert.alert('Cerrar sesión', '¿Quieres salir de tu cuenta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: logout }
        ]);

    const header = (
        <AppHeader
            eyebrow={todayLabel()}
            title="Supervisión"
            subtitle="Actividad general de la plataforma"
            right={<HeaderIconButton icon="log-out-outline" label="Cerrar sesión" onPress={salir} />}
        />
    );

    if (loading) return <Screen header={header}><LoadingState /></Screen>;
    if (error) return <Screen header={header}><ErrorState message={error} onRetry={reload} /></Screen>;

    const pendientes = s.documentosPendientes + s.empresasPendientes;

    return (
        <Screen header={header} refreshing={refreshing} onRefresh={refresh}>
            <Card style={styles.alert} onPress={pendientes ? () => goToTab(s.documentosPendientes ? 2 : 3) : undefined}>
                <View style={styles.alertIcon}>
                    <Ionicons name={pendientes ? 'alert-circle-outline' : 'checkmark-done-outline'} size={24} color={colors.white} />
                </View>
                <View style={styles.flex}>
                    <Text style={styles.alertTitle}>
                        {pendientes ? `${pendientes} elementos esperan tu revisión` : 'Todo está al día'}
                    </Text>
                    <Text style={styles.alertText}>
                        {s.documentosPendientes} documentos y {s.empresasPendientes} empresas pendientes de verificación
                    </Text>
                </View>
            </Card>

            <SectionHeader eyebrow="Comunidad" title="Usuarios" actionLabel="Gestionar" onAction={() => goToTab(1)} />
            <View style={styles.stats}>
                <StatCard icon="people-outline" label="Usuarios totales" value={s.usuarios} tone="primary" onPress={() => goToTab(1)} />
                <StatCard icon="person-outline" label="Candidatos" value={s.candidatos} tone="turquoise" />
            </View>
            <View style={styles.stats}>
                <StatCard icon="briefcase-outline" label="Reclutadores" value={s.reclutadores} tone="violet" />
                <StatCard icon="ban-outline" label="Cuentas suspendidas" value={s.suspendidos} tone="danger" onPress={() => goToTab(1)} />
            </View>

            <SectionHeader eyebrow="Mercado laboral" title="Actividad" />
            <View style={styles.stats}>
                <StatCard icon="megaphone-outline" label="Ofertas publicadas" value={s.ofertasPublicadas} detail={`${s.ofertasBorrador} en borrador`} tone="primary" />
                <StatCard icon="paper-plane-outline" label="Postulaciones" value={s.postulaciones} tone="success" />
            </View>
            <View style={styles.stats}>
                <StatCard icon="business-outline" label="Empresas" value={s.empresas} detail={`${s.empresasPendientes} por verificar`} tone="violet" onPress={() => goToTab(3)} />
                <StatCard icon="document-text-outline" label="Documentos por verificar" value={s.documentosPendientes} tone="warning" onPress={() => goToTab(2)} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    alert: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.midnight, borderColor: colors.midnight },
    alertIcon: {
        width: 46,
        height: 46,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flex: { flex: 1 },
    alertTitle: { fontSize: 15, fontWeight: '800', color: colors.white },
    alertText: { fontSize: 13, color: '#C9D3F5', marginTop: 2 },
    stats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }
});
