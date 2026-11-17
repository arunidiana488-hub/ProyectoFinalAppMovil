import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, AppHeader, Avatar, Badge, Card, ErrorState, InfoRow, LoadingState, Screen } from '../../components/ui';
import JobStatusBadge from '../../components/jobs/JobStatusBadge';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { jobsService } from '../../services/jobs.service';
import { applicationsService } from '../../services/applications.service';
import { colors, spacing, typography } from '../../theme';
import { EMPLOYMENT_TYPES, WORK_MODALITIES, labelOf } from '../../constants/options';
import { daysUntil, formatDate, formatSalary } from '../../utils/format';

// Detalle de una oferta. El candidato puede postular; la empresa puede editarla y ver postulaciones.
export default function JobDetailScreen({ params }) {
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();
    const toast = useToast();
    const insets = useSafeAreaInsets();
    const [enviando, setEnviando] = useState(false);
    const esCandidato = user?.role === 'candidate';

    const { data, loading, error, reload } = useApi(async () => {
        const [oferta, mias] = await Promise.all([
            jobsService.get(params.id),
            esCandidato ? applicationsService.mine() : Promise.resolve([])
        ]);
        return { oferta, postulacion: mias.find((p) => p.job_id === params.id) };
    }, [params.id]);

    const postular = () => {
        Alert.alert('Confirmar postulación', `¿Quieres postularte a «${data.oferta.job_title}»?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Postularme',
                onPress: async () => {
                    setEnviando(true);
                    try {
                        await applicationsService.apply(params.id);
                        toast('¡Postulación enviada! Te avisaremos de cada avance.');
                        reload();
                    } catch (e) {
                        toast(e.message, 'error');
                    } finally {
                        setEnviando(false);
                    }
                }
            }
        ]);
    };

    const header = <AppHeader title="Detalle de la oferta" onBack={goBack} />;

    if (loading) return <Screen header={header}><LoadingState /></Screen>;
    if (error) return <Screen header={header}><ErrorState message={error} onRetry={reload} /></Screen>;

    const { oferta, postulacion } = data;
    const empresa = oferta.company?.business_name || 'Empresa';
    const dias = daysUntil(oferta.expiration_date);
    const gestiona = user?.role === 'recruiter';

    const pie = esCandidato ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            {postulacion ? (
                <AppButton
                    title="Ver mi postulación"
                    variant="secondary"
                    icon="document-text-outline"
                    onPress={() => navigate('ApplicationDetail', { id: postulacion.id })}
                    full
                />
            ) : (
                <AppButton title="Postularme a esta oferta" icon="send" onPress={postular} loading={enviando} disabled={dias !== null && dias < 0} full />
            )}
        </View>
    ) : gestiona ? (
        <View style={[styles.footer, styles.footerRow, { paddingBottom: insets.bottom + spacing.md }]}>
            <AppButton title="Editar" variant="outline" icon="create-outline" onPress={() => navigate('JobForm', { id: oferta.id })} style={styles.flex} />
            <AppButton title="Postulaciones" icon="people-outline" onPress={() => navigate('ReceivedApplications', { jobId: oferta.id })} style={styles.flex} />
        </View>
    ) : null;

    return (
        <Screen header={header} footer={pie}>
            <Card>
                <View style={styles.companyRow}>
                    <Avatar name={empresa} uri={oferta.company?.logo} size={56} square />
                    <View style={styles.flex}>
                        <Text style={styles.title}>{oferta.job_title}</Text>
                        <Text style={styles.company}>
                            {empresa}{' '}
                            {oferta.company?.verification_status === 'verified' && (
                                <Ionicons name="checkmark-circle" size={14} color={colors.turquoise} />
                            )}
                        </Text>
                    </View>
                </View>
                <View style={styles.badges}>
                    {gestiona && <JobStatusBadge status={oferta.publication_status} />}
                    {!!oferta.work_modality && <Badge label={labelOf(WORK_MODALITIES, oferta.work_modality)} tone="primary" icon="laptop-outline" />}
                    {!!oferta.employment_type && <Badge label={labelOf(EMPLOYMENT_TYPES, oferta.employment_type)} tone="violet" />}
                    {postulacion && <ApplicationStatusBadge status={postulacion.application_status} />}
                </View>
                <Text style={styles.salary}>{formatSalary(oferta.salary_min, oferta.salary_max, oferta.salary_currency)}</Text>
                <Text style={styles.salaryLabel}>Salario mensual</Text>
            </Card>

            <Card>
                <InfoRow icon="location-outline" label="Ubicación" value={[oferta.city, oferta.department, oferta.country].filter(Boolean).join(', ')} />
                <InfoRow icon="people-outline" label="Vacantes" value={String(oferta.vacancies ?? 1)} />
                <InfoRow icon="time-outline" label="Experiencia" value={oferta.experience_required} />
                <InfoRow icon="school-outline" label="Formación" value={oferta.education_required} />
                <InfoRow
                    icon="calendar-outline"
                    label="Fecha límite"
                    value={oferta.expiration_date ? `${formatDate(oferta.expiration_date)}${dias !== null ? (dias < 0 ? ' · cerrada' : ` · faltan ${dias} días`) : ''}` : 'Sin fecha límite'}
                    last
                />
            </Card>

            {[
                ['Sobre el puesto', oferta.description, 'reader-outline'],
                ['Requisitos', oferta.requirements, 'checkmark-done-outline'],
                ['Responsabilidades', oferta.responsibilities, 'list-outline']
            ]
                .filter(([, texto]) => !!texto)
                .map(([titulo, texto, icono]) => (
                    <Card key={titulo}>
                        <View style={styles.sectionHead}>
                            <Ionicons name={icono} size={18} color={colors.primary} />
                            <Text style={styles.sectionTitle}>{titulo}</Text>
                        </View>
                        <Text style={styles.text}>{texto}</Text>
                    </Card>
                ))}

            <Text style={styles.published}>Publicada el {formatDate(oferta.publication_date || oferta.created_at)}</Text>
        </Screen>
    );
}

const styles = StyleSheet.create({
    companyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1 },
    title: { ...typography.h2, color: colors.text },
    company: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
    salary: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
    salaryLabel: { fontSize: 12, color: colors.textSecondary },
    sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
    text: { fontSize: 14, lineHeight: 22, color: colors.text },
    published: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border
    },
    footerRow: { flexDirection: 'row', gap: spacing.md }
});
