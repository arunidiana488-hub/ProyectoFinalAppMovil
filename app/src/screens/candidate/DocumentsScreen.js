import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, AppHeader, Card, EmptyState, ErrorState, HeaderIconButton, LoadingState, Screen } from '../../components/ui';
import DocumentItem from '../../components/documents/DocumentItem';
import DocumentForm from '../../components/documents/DocumentForm';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { documentsService } from '../../services/documents.service';
import { colors, radius, spacing } from '../../theme';

// Títulos y certificados del candidato (verificados por el administrador)
export default function DocumentsScreen() {
    const { goBack } = useNavigation();
    const toast = useToast();
    const [formulario, setFormulario] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const { data, setData, loading, error, refreshing, refresh, reload } = useApi(() => documentsService.mine());

    const registrar = async (datos) => {
        setGuardando(true);
        try {
            const nuevo = await documentsService.create(datos);
            setData((lista) => [nuevo, ...lista]);
            setFormulario(false);
            toast('Documento registrado. Queda pendiente de verificación.');
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const eliminar = (doc) =>
        Alert.alert('Eliminar documento', `¿Eliminar «${doc.file_name}»?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await documentsService.remove(doc.id);
                        setData((lista) => lista.filter((d) => d.id !== doc.id));
                        toast('Documento eliminado');
                    } catch (e) {
                        toast(e.message, 'error');
                    }
                }
            }
        ]);

    const lista = data || [];
    const verificados = lista.filter((d) => d.verification_status === 'verified').length;

    return (
        <Screen
            header={
                <AppHeader
                    title="Títulos y certificados"
                    onBack={goBack}
                    right={<HeaderIconButton icon="add" tone="primary" label="Registrar documento" onPress={() => setFormulario(true)} />}
                />
            }
            refreshing={refreshing}
            onRefresh={refresh}
        >
            <View style={styles.banner}>
                <Ionicons name="shield-checkmark-outline" size={22} color={colors.turquoise} />
                <Text style={styles.bannerText}>
                    Los documentos verificados aumentan la confianza de los reclutadores en tu perfil.
                </Text>
            </View>

            {loading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState message={error} onRetry={reload} />
            ) : lista.length === 0 ? (
                <Card>
                    <EmptyState icon="ribbon-outline" title="Aún no registraste documentos" message="Registra tu título académico, técnico o tus certificados." actionLabel="Registrar documento" onAction={() => setFormulario(true)} />
                </Card>
            ) : (
                <>
                    <Text style={styles.count}>{verificados} de {lista.length} verificados</Text>
                    {lista.map((doc) => (
                        <DocumentItem key={doc.id} document={doc}>
                            {doc.verification_status !== 'verified' && (
                                <AppButton title="Eliminar" variant="ghost" size="sm" icon="trash-outline" onPress={() => eliminar(doc)} style={styles.delete} />
                            )}
                        </DocumentItem>
                    ))}
                </>
            )}

            <DocumentForm visible={formulario} onClose={() => setFormulario(false)} onSubmit={registrar} submitting={guardando} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.lg,
        backgroundColor: colors.midnight,
        marginBottom: spacing.lg
    },
    bannerText: { flex: 1, fontSize: 13, color: colors.white, lineHeight: 19 },
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md },
    delete: { alignSelf: 'flex-end', marginTop: spacing.sm }
});
