import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton, AppHeader, Card, EmptyState, ErrorState, LoadingState, Screen } from '../../components/ui';
import JobForm from '../../components/jobs/JobForm';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { companiesService } from '../../services/companies.service';
import { jobsService } from '../../services/jobs.service';
import { spacing } from '../../theme';

// Publicar (POST /api/jobs) o editar (PUT /api/jobs/:id) una vacante
export default function JobFormScreen({ params = {} }) {
    const { goBack, goToTab } = useNavigation();
    const toast = useToast();
    const [guardando, setGuardando] = useState(false);
    const editando = !!params.id;

    const { data, loading, error, reload } = useApi(async () => {
        const [empresas, oferta] = await Promise.all([
            companiesService.mine(),
            editando ? jobsService.get(params.id) : Promise.resolve(null)
        ]);
        return { empresas, oferta };
    }, [params.id]);

    const guardar = async (datos, estado) => {
        setGuardando(true);
        try {
            if (editando) {
                await jobsService.update(params.id, datos);
                toast(estado === 'published' ? 'Vacante actualizada y publicada' : 'Cambios guardados como borrador');
            } else {
                await jobsService.create(datos);
                toast(estado === 'published' ? '¡Vacante publicada! Ya aparece en el buscador.' : 'Vacante guardada como borrador');
            }
            goBack();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const cerrarOferta = async () => {
        try {
            await jobsService.update(params.id, { publication_status: 'closed' });
            toast('Vacante cerrada: ya no recibe postulaciones');
            goBack();
        } catch (e) {
            toast(e.message, 'error');
        }
    };

    const eliminar = () =>
        Alert.alert('Eliminar vacante', 'Esta acción no se puede deshacer. ¿Deseas continuar?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await jobsService.remove(params.id);
                        toast('Vacante eliminada');
                        goToTab(1);
                    } catch (e) {
                        toast(e.message, 'error');
                    }
                }
            }
        ]);

    const header = (
        <AppHeader
            title={editando ? 'Editar vacante' : 'Publicar vacante'}
            subtitle={editando ? 'Los cambios se verán al instante' : 'Completa los datos del puesto'}
            onBack={goBack}
        />
    );

    if (loading) return <Screen header={header}><LoadingState /></Screen>;
    if (error) return <Screen header={header}><ErrorState message={error} onRetry={reload} /></Screen>;

    if (!data.empresas.length) {
        return (
            <Screen header={header}>
                <Card>
                    <EmptyState
                        icon="business-outline"
                        title="Primero registra tu empresa"
                        message="Las vacantes se publican a nombre de una empresa."
                        actionLabel="Registrar empresa"
                        onAction={() => goToTab(4)}
                    />
                </Card>
            </Screen>
        );
    }

    return (
        <Screen header={header}>
            <JobForm job={data.oferta} companies={data.empresas} onSubmit={guardar} submitting={guardando} />

            {editando && (
                <View style={styles.danger}>
                    {data.oferta?.publication_status !== 'closed' && (
                        <AppButton title="Cerrar vacante" variant="outline" icon="lock-closed-outline" onPress={cerrarOferta} style={styles.flex} />
                    )}
                    <AppButton title="Eliminar" variant="danger" icon="trash-outline" onPress={eliminar} style={styles.flex} />
                </View>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    danger: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
    flex: { flex: 1 }
});
