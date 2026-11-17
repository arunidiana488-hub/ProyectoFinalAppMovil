import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader, EmptyState, ErrorState, LoadingState, Screen, SearchBar } from '../../components/ui';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi, useDebounce } from '../../hooks/useApi';
import { jobsService } from '../../services/jobs.service';
import { colors, spacing } from '../../theme';

// Buscador de ofertas laborales (GET /api/jobs con filtros)
export default function JobsScreen() {
    const { navigate } = useNavigation();
    const [texto, setTexto] = useState('');
    const [filtros, setFiltros] = useState({ work_modality: '', employment_type: '' });
    const q = useDebounce(texto.trim(), 450);

    const { data, loading, error, refreshing, refresh, reload } = useApi(
        () => jobsService.list({ q, ...filtros }),
        [q, filtros.work_modality, filtros.employment_type]
    );

    const hayFiltros = !!(q || filtros.work_modality || filtros.employment_type);

    const encabezado = (
        <View>
            <SearchBar value={texto} onChangeText={setTexto} placeholder="Cargo, palabra clave o habilidad" />
            <JobFilters filters={filtros} onChange={setFiltros} />
            {!loading && !error && (
                <Text style={styles.count}>
                    {data.length} {data.length === 1 ? 'oportunidad encontrada' : 'oportunidades encontradas'}
                </Text>
            )}
        </View>
    );

    return (
        <Screen scroll={false} padded={false} header={<AppHeader eyebrow="Explora el mercado" title="Oportunidades" />}>
            <FlatList
                data={loading || error ? [] : data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <JobCard job={item} onPress={() => navigate('JobDetail', { id: item.id })} />}
                ListHeaderComponent={encabezado}
                ListEmptyComponent={
                    loading ? (
                        <LoadingState message="Buscando oportunidades…" />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <EmptyState
                            title="Sin coincidencias"
                            message={hayFiltros ? 'Prueba con otra palabra o quita los filtros.' : 'Todavía no hay ofertas publicadas.'}
                            actionLabel={hayFiltros ? 'Limpiar filtros' : undefined}
                            onAction={() => {
                                setTexto('');
                                setFiltros({ work_modality: '', employment_type: '' });
                            }}
                        />
                    )
                }
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
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
