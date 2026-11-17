import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader, ChipSelect, EmptyState, ErrorState, LoadingState, Screen } from '../../components/ui';
import ApplicationCard from '../../components/applications/ApplicationCard';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { applicationsService } from '../../services/applications.service';
import { colors, spacing } from '../../theme';
import { ACTIVE_APPLICATION_STATUS } from '../../constants/options';

const FILTROS = [
    { value: 'active', label: 'En proceso' },
    { value: 'interview', label: 'Entrevistas' },
    { value: 'finished', label: 'Finalizadas' }
];

// Mis postulaciones (candidato)
export default function MyApplicationsScreen() {
    const { navigate, goToTab } = useNavigation();
    const [filtro, setFiltro] = useState('');
    const { data, loading, error, refreshing, refresh, reload } = useApi(() => applicationsService.mine());

    const lista = (data || []).filter((p) => {
        if (filtro === 'active') return ACTIVE_APPLICATION_STATUS.includes(p.application_status);
        if (filtro === 'interview') return p.application_status === 'interview';
        if (filtro === 'finished') return ['hired', 'rejected'].includes(p.application_status);
        return true;
    });

    return (
        <Screen scroll={false} padded={false} header={<AppHeader eyebrow="Seguimiento" title="Mis postulaciones" />}>
            <FlatList
                data={loading || error ? [] : lista}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ApplicationCard application={item} onPress={() => navigate('ApplicationDetail', { id: item.id })} />
                )}
                ListHeaderComponent={
                    <View>
                        <ChipSelect options={FILTROS} allLabel="Todas" value={filtro} onChange={setFiltro} />
                        {!loading && !error && (
                            <Text style={styles.count}>{lista.length} {lista.length === 1 ? 'postulación' : 'postulaciones'}</Text>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <EmptyState
                            icon="paper-plane-outline"
                            title={filtro ? 'Nada en esta categoría' : 'Aún no te postulaste'}
                            message="Explora las oportunidades y postúlate con un toque."
                            actionLabel="Buscar oportunidades"
                            onAction={() => goToTab(1)}
                        />
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
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md }
});
