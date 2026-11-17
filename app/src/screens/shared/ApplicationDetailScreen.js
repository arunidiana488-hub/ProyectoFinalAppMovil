import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppHeader, Avatar, Card, ErrorState, InfoRow, LoadingState, Screen, SectionHeader } from '../../components/ui';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import StatusTimeline from '../../components/applications/StatusTimeline';
import StatusSelector from '../../components/applications/StatusSelector';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { applicationsService } from '../../services/applications.service';
import { colors, spacing, typography } from '../../theme';
import { WORK_MODALITIES, labelOf } from '../../constants/options';
import { formatDate } from '../../utils/format';

// Detalle de una postulación con su historial.
// Candidato: puede retirarla. Reclutador: puede cambiar la etapa y ver el perfil del candidato.
export default function ApplicationDetailScreen({ params }) {
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();
    const toast = useToast();
    const insets = useSafeAreaInsets();
    const [selector, setSelector] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const { data: postulacion, setData, loading, error, reload } = useApi(
        () => applicationsService.get(params.id),
        [params.id]
    );

    const esCandidato = user?.role === 'candidate';
    const header = <AppHeader title="Postulación" onBack={goBack} />;

    if (loading) return <Screen header={header}><LoadingState /></Screen>;
    if (error) return <Screen header={header}><ErrorState message={error} onRetry={reload} /></Screen>;

    const oferta = postulacion.job;
    const candidato = postulacion.candidate;
    const finalizada = ['hired', 'rejected'].includes(postulacion.application_status);

    const cambiarEtapa = async (estado, nota) => {
        setGuardando(true);
        try {
            const actualizada = await applicationsService.changeStatus(postulacion.id, estado, nota);
            setData(actualizada);
            setSelector(false);
            toast('Etapa actualizada');
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const retirar = () => {
        Alert.alert('Retirar postulación', 'La empresa dejará de ver tu postulación. ¿Deseas continuar?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Retirar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await applicationsService.withdraw(postulacion.id);
                        toast('Postulación retirada');
                        goBack();
                    } catch (e) {
                        toast(e.message, 'error');
                    }
                }
            }
        ]);
    };

    const pie = esCandidato ? (
        !finalizada && (
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                <AppButton title="Retirar postulación" variant="danger" icon="close-circle-outline" onPress={retirar} full />
            </View>
        )
    ) : (
        <View style={[styles.footer, styles.footerRow, { paddingBottom: insets.bottom + spacing.md }]}>
            <AppButton title="Ver perfil" variant="outline" icon="person-outline" onPress={() => navigate('CandidateProfile', { id: candidato?.id })} style={styles.flex} />
            <AppButton title="Cambiar etapa" icon="swap-horizontal" onPress={() => setSelector(true)} style={styles.flex} />
        </View>
    );

    return (
        <Screen header={header} footer={pie}>
            {!esCandidato && candidato && (
                <Card>
                    <View style={styles.row}>
                        <Avatar name={candidato.full_name} uri={candidato.profile_photo} size={52} />
                        <View style={styles.flex}>
                            <Text style={styles.name}>{candidato.full_name}</Text>
                            <Text style={styles.muted}>{candidato.email}</Text>
                            {!!candidato.phone && <Text style={styles.muted}>{candidato.phone}</Text>}
                        </View>
                    </View>
                </Card>
            )}

            <Card onPress={oferta ? () => navigate('JobDetail', { id: oferta.id }) : undefined}>
                <Text style={styles.overline}>Oferta</Text>
                <Text style={styles.title}>{oferta?.job_title || 'Oferta eliminada'}</Text>
                <Text style={styles.muted}>
                    {[oferta?.company?.business_name, oferta?.city, labelOf(WORK_MODALITIES, oferta?.work_modality, '')].filter(Boolean).join(' · ')}
                </Text>
            </Card>

            <Card>
                <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Etapa actual</Text>
                    <ApplicationStatusBadge status={postulacion.application_status} />
                </View>
                <InfoRow icon="calendar-outline" label="Fecha de postulación" value={formatDate(postulacion.application_date)} last />
            </Card>

            <SectionHeader title="Historial del proceso" eyebrow="Seguimiento" />
            <Card>
                <StatusTimeline history={postulacion.history} />
            </Card>

            <StatusSelector
                visible={selector}
                current={postulacion.application_status}
                onClose={() => setSelector(false)}
                onSubmit={cambiarEtapa}
                submitting={guardando}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1 },
    name: { ...typography.h3, color: colors.text },
    muted: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    overline: { ...typography.overline, color: colors.primary, marginBottom: 2 },
    title: { ...typography.h3, fontSize: 17, color: colors.text },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    statusLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border
    },
    footerRow: { flexDirection: 'row', gap: spacing.md }
});
