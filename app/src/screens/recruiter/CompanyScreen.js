import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppHeader, Avatar, Card, ErrorState, InfoRow, LoadingState, Screen, SectionHeader } from '../../components/ui';
import CompanyCard from '../../components/companies/CompanyCard';
import CompanyForm from '../../components/companies/CompanyForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useApi } from '../../hooks/useApi';
import { companiesService } from '../../services/companies.service';
import { colors, spacing } from '../../theme';

// Mi empresa (registrar / editar) y mi cuenta
export default function CompanyScreen() {
    const { user, logout, refreshUser } = useAuth();
    const toast = useToast();
    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const { data, loading, error, refreshing, refresh, reload } = useApi(() => companiesService.mine());
    const empresa = data?.[0];

    const guardar = async (datos) => {
        setGuardando(true);
        try {
            if (empresa) {
                await companiesService.update(empresa.id, datos);
                toast('Datos de la empresa actualizados');
            } else {
                await companiesService.create(datos);
                toast('Empresa registrada. Ya puedes publicar vacantes.');
                refreshUser().catch(() => {});
            }
            setEditando(false);
            reload();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const salir = () =>
        Alert.alert('Cerrar sesión', '¿Quieres salir de tu cuenta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: logout }
        ]);

    const header = <AppHeader eyebrow="Configuración" title={empresa ? 'Mi empresa' : 'Registra tu empresa'} />;

    if (loading) return <Screen header={header}><LoadingState /></Screen>;
    if (error) return <Screen header={header}><ErrorState message={error} onRetry={reload} /></Screen>;

    return (
        <Screen header={header} refreshing={refreshing} onRefresh={refresh}>
            {!empresa || editando ? (
                <Card style={styles.formCard}>
                    {!empresa && (
                        <Text style={styles.intro}>
                            Registra tu empresa para publicar vacantes. Un administrador la verificará y aparecerá con el sello de verificada.
                        </Text>
                    )}
                    <CompanyForm company={empresa} onSubmit={guardar} onCancel={empresa ? () => setEditando(false) : undefined} submitting={guardando} />
                </Card>
            ) : (
                <>
                    <CompanyCard company={empresa}>
                        {!!empresa.description && <Text style={styles.description}>{empresa.description}</Text>}
                    </CompanyCard>
                    <Card>
                        <InfoRow icon="mail-outline" label="Correo" value={empresa.email} />
                        <InfoRow icon="call-outline" label="Teléfono" value={empresa.phone} />
                        <InfoRow icon="globe-outline" label="Sitio web" value={empresa.website} />
                        <InfoRow icon="location-outline" label="Dirección" value={[empresa.address, empresa.city, empresa.department].filter(Boolean).join(', ')} last />
                    </Card>
                    <AppButton title="Editar datos de la empresa" variant="secondary" icon="create-outline" onPress={() => setEditando(true)} full />
                </>
            )}

            <SectionHeader eyebrow="Cuenta" title="Mi cuenta" />
            <Card>
                <View style={styles.account}>
                    <Avatar name={user?.full_name} uri={user?.profile_photo} size={46} />
                    <View style={styles.flex}>
                        <Text style={styles.name}>{user?.full_name}</Text>
                        <Text style={styles.email}>{user?.email}</Text>
                    </View>
                </View>
            </Card>
            <AppButton title="Cerrar sesión" variant="outline" icon="log-out-outline" onPress={salir} full />
        </Screen>
    );
}

const styles = StyleSheet.create({
    formCard: { padding: spacing.xl },
    intro: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.lg },
    description: { fontSize: 14, color: colors.text, lineHeight: 21, marginTop: spacing.md },
    account: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: colors.text },
    email: { fontSize: 13, color: colors.textSecondary }
});
