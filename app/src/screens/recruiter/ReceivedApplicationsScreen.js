import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader, ChipSelect, EmptyState, ErrorState, LoadingState, Screen } from '../../components/ui';
import ApplicationCard from '../../components/applications/ApplicationCard';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { applicationsService } from '../../services/applications.service';
import { jobsService } from '../../services/jobs.service';
import { colors, spacing } from '../../theme';
import { APPLICATION_STATUS } from '../../constants/options';

/**
 * Postulaciones recibidas, filtradas por vacante y por etapa.
 * Se usa como pestaña y también desde el detalle de una vacante (params.jobId).
 */
export default function ReceivedApplicationsScreen({ params = {} }) {
    const { navigate, goBack, canGoBack } = useNavigation();
    const [oferta, setOferta] = useState(params.jobId || '');
    const [etapa, setEtapa] = useState('');

    const { data, loading, error, refreshing, refresh, reload } = useApi(async () => {
        const [postulaciones, ofertas] = await Promise.all([
            applicationsService.received(),
            jobsService.list({ mine: 'true' })
        ]);
        return { postulaciones, ofertas };
    });

    const postulaciones = (data?.postulaciones || []).filter(
        (p) => (!oferta || p.job_id === oferta) && (!etapa || p.application_status === etapa)
    );
    const opcionesOfertas = (data?.ofertas || []).map((o) => ({ value: o.id, label: o.job_title }));

    return (
        <Screen
            scroll={false}
            padded={false}
            header={
                <AppHeader
                    eyebrow="Proceso de selección"
                    title="Postulaciones"
                    onBack={params.jobId && canGoBack ? goBack : undefined}
                />
            }
        >
            <FlatList
                data={loading || error ? [] : postulaciones}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ApplicationCard application={item} perspective="recruiter" onPress={() => navigate('ApplicationDetail', { id: item.id })} />
                )}
                ListHeaderComponent={
                    <View>
                        {opcionesOfertas.length > 1 && (
                            <ChipSelect options={opcionesOfertas} allLabel="Todas las vacantes" value={oferta} onChange={setOferta} style={styles.filter} />
                        )}
                        <ChipSelect options={APPLICATION_STATUS} allLabel="Todas las etapas" value={etapa} onChange={setEtapa} />
                        {!loading && !error && <Text style={styles.count}>{postulaciones.length} postulaciones</Text>}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <EmptyState icon="people-outline" title="Sin postulaciones" message={oferta || etapa ? 'Prueba con otros filtros.' : 'Cuando un candidato se postule, aparecerá aquí.'} />
                    )
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl * 2 },
    filter: { marginBottom: spacing.sm },
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md }
});
