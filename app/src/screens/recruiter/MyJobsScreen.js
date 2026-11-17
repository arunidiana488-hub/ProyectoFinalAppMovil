import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader, ChipSelect, EmptyState, ErrorState, HeaderIconButton, LoadingState, Screen } from '../../components/ui';
import JobCard from '../../components/jobs/JobCard';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { jobsService } from '../../services/jobs.service';
import { colors, spacing } from '../../theme';
import { PUBLICATION_STATUS } from '../../constants/options';

// Vacantes de mi empresa (GET /api/jobs?mine=true)
export default function MyJobsScreen() {
    const { navigate } = useNavigation();
    const [estado, setEstado] = useState('');

    const { data, loading, error, refreshing, refresh, reload } = useApi(() => jobsService.list({ mine: 'true' }));
    const lista = (data || []).filter((o) => !estado || o.publication_status === estado);

    return (
        <Screen
            scroll={false}
            padded={false}
            header={
                <AppHeader
                    eyebrow="Atracción de talento"
                    title="Mis vacantes"
                    right={<HeaderIconButton icon="add" tone="primary" label="Publicar vacante" onPress={() => navigate('JobForm')} />}
                />
            }
        >
            <FlatList
                data={loading || error ? [] : lista}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <JobCard job={item} showStatus onPress={() => navigate('JobDetail', { id: item.id })} />}
                ListHeaderComponent={
                    <View>
                        <ChipSelect options={PUBLICATION_STATUS} allLabel="Todas" value={estado} onChange={setEstado} />
                        {!loading && !error && <Text style={styles.count}>{lista.length} vacantes</Text>}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <EmptyState
                            icon="briefcase-outline"
                            title={estado ? 'No hay vacantes en este estado' : 'Aún no publicaste vacantes'}
                            message="Publica tu primera oferta y empieza a recibir candidatos."
                            actionLabel="Publicar vacante"
                            onAction={() => navigate('JobForm')}
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
