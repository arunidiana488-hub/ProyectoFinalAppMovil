import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppHeader, BottomSheet, ChipSelect, EmptyState, ErrorState, LoadingState, Screen, TextField } from '../../components/ui';
import DocumentItem from '../../components/documents/DocumentItem';
import { useToast } from '../../context/ToastContext';
import { useApi } from '../../hooks/useApi';
import { documentsService } from '../../services/documents.service';
import { colors, spacing } from '../../theme';
import { VERIFICATION_STATUS } from '../../constants/options';

// Verificación de títulos y certificados (PATCH /api/documents/:id/review)
export default function DocumentsReviewScreen() {
    const toast = useToast();
    const [estado, setEstado] = useState('pending');
    const [rechazo, setRechazo] = useState(null); // documento que se está rechazando
    const [motivo, setMotivo] = useState('');
    const [procesando, setProcesando] = useState(null);

    const { data, setData, loading, error, refreshing, refresh, reload } = useApi(
        () => documentsService.list(estado || undefined),
        [estado]
    );

    const revisar = async (doc, resultado, razon) => {
        setProcesando(doc.id);
        try {
            const actualizado = await documentsService.review(doc.id, resultado, razon);
            setData((lista) =>
                estado ? lista.filter((d) => d.id !== doc.id) : lista.map((d) => (d.id === doc.id ? actualizado : d))
            );
            toast(resultado === 'verified' ? 'Documento verificado' : 'Documento rechazado');
            setRechazo(null);
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setProcesando(null);
        }
    };

    return (
        <Screen scroll={false} padded={false} header={<AppHeader eyebrow="Verificación" title="Documentos" />}>
            <FlatList
                data={loading || error ? [] : data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <DocumentItem document={item} showOwner>
                        {item.verification_status === 'pending' && (
                            <View style={styles.actions}>
                                <AppButton
                                    title="Rechazar"
                                    variant="danger"
                                    size="sm"
                                    icon="close"
                                    onPress={() => {
                                        setMotivo('');
                                        setRechazo(item);
                                    }}
                                    disabled={procesando === item.id}
                                    style={styles.flex}
                                />
                                <AppButton
                                    title="Verificar"
                                    size="sm"
                                    icon="checkmark"
                                    onPress={() => revisar(item, 'verified')}
                                    loading={procesando === item.id}
                                    style={styles.flex}
                                />
                            </View>
                        )}
                    </DocumentItem>
                )}
                ListHeaderComponent={
                    <View>
                        <ChipSelect options={VERIFICATION_STATUS} allLabel="Todos" value={estado} onChange={setEstado} />
                        {!loading && !error && <Text style={styles.count}>{data.length} documentos</Text>}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <EmptyState icon="checkmark-done-outline" title={estado === 'pending' ? '¡Todo revisado!' : 'Sin documentos'} message={estado === 'pending' ? 'No hay documentos pendientes de verificación.' : undefined} />
                    )
                }
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />}
            />

            <BottomSheet
                visible={!!rechazo}
                onClose={() => setRechazo(null)}
                title="Rechazar documento"
                subtitle={rechazo?.file_name}
                footer={
                    <AppButton
                        title="Confirmar rechazo"
                        variant="danger"
                        onPress={() => revisar(rechazo, 'rejected', motivo.trim())}
                        loading={procesando === rechazo?.id}
                        disabled={motivo.trim().length < 5}
                        full
                    />
                }
            >
                <TextField
                    label="Motivo del rechazo"
                    required
                    multiline
                    value={motivo}
                    onChangeText={setMotivo}
                    placeholder="Ej. El documento no es legible o los datos no coinciden"
                    hint="El candidato verá este motivo"
                />
            </BottomSheet>
        </Screen>
    );
}

const styles = StyleSheet.create({
    list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl * 2 },
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
    flex: { flex: 1 }
});
