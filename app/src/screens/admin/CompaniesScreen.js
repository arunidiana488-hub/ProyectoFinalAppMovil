import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppHeader, ChipSelect, EmptyState, ErrorState, LoadingState, Screen } from '../../components/ui';
import CompanyCard from '../../components/companies/CompanyCard';
import { useToast } from '../../context/ToastContext';
import { useApi } from '../../hooks/useApi';
import { companiesService } from '../../services/companies.service';
import { colors, spacing } from '../../theme';
import { VERIFICATION_STATUS } from '../../constants/options';

// Verificación de empresas (PATCH /api/companies/:id/verification)
export default function CompaniesScreen() {
    const toast = useToast();
    const [estado, setEstado] = useState('');
    const [procesando, setProcesando] = useState(null);

    const { data, setData, loading, error, refreshing, refresh, reload } = useApi(
        () => companiesService.list({ verification_status: estado }),
        [estado]
    );

    const verificar = async (empresa, resultado) => {
        setProcesando(empresa.id);
        try {
            const actualizada = await companiesService.verify(empresa.id, resultado);
            setData((lista) =>
                estado && estado !== resultado
                    ? lista.filter((e) => e.id !== empresa.id)
                    : lista.map((e) => (e.id === empresa.id ? actualizada : e))
            );
            toast(resultado === 'verified' ? 'Empresa verificada' : 'Empresa rechazada');
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setProcesando(null);
        }
    };

    return (
        <Screen scroll={false} padded={false} header={<AppHeader eyebrow="Verificación" title="Empresas" />}>
            <FlatList
                data={loading || error ? [] : data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CompanyCard company={item}>
                        {item.verification_status !== 'verified' && (
                            <View style={styles.actions}>
                                {item.verification_status === 'pending' && (
                                    <AppButton title="Rechazar" variant="danger" size="sm" onPress={() => verificar(item, 'rejected')} disabled={procesando === item.id} style={styles.flex} />
                                )}
                                <AppButton title="Verificar" size="sm" icon="shield-checkmark-outline" onPress={() => verificar(item, 'verified')} loading={procesando === item.id} style={styles.flex} />
                            </View>
                        )}
                    </CompanyCard>
                )}
                ListHeaderComponent={
                    <View>
                        <ChipSelect options={VERIFICATION_STATUS} allLabel="Todas" value={estado} onChange={setEstado} />
                        {!loading && !error && <Text style={styles.count}>{data.length} empresas</Text>}
                    </View>
                }
                ListEmptyComponent={
                    loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={reload} /> : <EmptyState icon="business-outline" title="Sin empresas en este estado" />
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
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
    flex: { flex: 1 }
});
