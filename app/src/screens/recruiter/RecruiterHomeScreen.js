import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, Card, EmptyState, ErrorState, LoadingState, Screen, SectionHeader, StatCard } from '../../components/ui';
import ApplicationCard from '../../components/applications/ApplicationCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { companiesService } from '../../services/companies.service';
import { jobsService } from '../../services/jobs.service';
import { applicationsService } from '../../services/applications.service';
import { colors, radius, spacing, typography } from '../../theme';
import { firstName, todayLabel } from '../../utils/format';

// Panel de inicio del reclutador
export default function RecruiterHomeScreen() {
    const { user } = useAuth();
    const { navigate, goToTab } = useNavigation();

    const { data, loading, error, refreshing, refresh, reload } = useApi(async () => {
        const empresas = await companiesService.mine();
        if (!empresas.length) return { empresas, ofertas: [], postulaciones: [] };
        const [ofertas, postulaciones] = await Promise.all([
            jobsService.list({ mine: 'true' }),
            applicationsService.received()
        ]);
        return { empresas, ofertas, postulaciones };
    });

    if (loading) return <Screen><LoadingState message="Cargando tu panel…" /></Screen>;
    if (error) return <Screen><ErrorState message={error} onRetry={reload} /></Screen>;

    const { empresas, ofertas, postulaciones } = data;
    const empresa = empresas[0];
    const publicadas = ofertas.filter((o) => o.publication_status === 'published').length;
    const nuevas = postulaciones.filter((p) => p.application_status === 'pending').length;
    const entrevistas = postulaciones.filter((p) => p.application_status === 'interview').length;
    const seleccionados = postulaciones.filter((p) => p.application_status === 'hired').length;

    return (
        <Screen refreshing={refreshing} onRefresh={refresh}>
            <Text style={styles.date}>{todayLabel()}</Text>
            <Text style={styles.hello}>Hola, {firstName(user?.full_name)}</Text>
            <Text style={styles.subtitle}>{empresa ? empresa.business_name : 'Tu equipo empieza aquí'}</Text>

            {!empresa ? (
                <Card style={styles.setup}>
                    <View style={styles.setupIcon}>
                        <Ionicons name="business-outline" size={26} color={colors.white} />
                    </View>
                    <Text style={styles.setupTitle}>Registra tu empresa</Text>
                    <Text style={styles.setupText}>
                        Para publicar vacantes y recibir postulaciones, primero registra los datos de tu empresa.
                    </Text>
                    <AppButton title="Registrar empresa" variant="light" icon="arrow-forward" onPress={() => goToTab(4)} style={styles.setupButton} />
                </Card>
            ) : (
                <>
                    <AppButton title="Publicar nueva vacante" icon="add-circle-outline" onPress={() => navigate('JobForm')} full style={styles.cta} />

                    <View style={styles.stats}>
                        <StatCard icon="briefcase-outline" label="Vacantes publicadas" value={publicadas} detail={`${ofertas.length} en total`} tone="primary" onPress={() => goToTab(1)} />
                        <StatCard icon="mail-unread-outline" label="Postulaciones nuevas" value={nuevas} detail={`${postulaciones.length} recibidas`} tone="turquoise" onPress={() => goToTab(2)} />
                    </View>
                    <View style={styles.stats}>
                        <StatCard icon="chatbubbles-outline" label="En entrevista" value={entrevistas} tone="violet" onPress={() => goToTab(2)} />
                        <StatCard icon="trophy-outline" label="Seleccionados" value={seleccionados} tone="success" onPress={() => goToTab(2)} />
                    </View>

                    <SectionHeader eyebrow="Actividad" title="Últimas postulaciones" actionLabel="Ver todas" onAction={() => goToTab(2)} />
                    {postulaciones.length === 0 ? (
                        <Card>
                            <EmptyState icon="people-outline" title="Aún no recibiste postulaciones" message="Publica una vacante para empezar a recibir candidatos." />
                        </Card>
                    ) : (
                        postulaciones.slice(0, 3).map((p) => (
                            <ApplicationCard key={p.id} application={p} perspective="recruiter" onPress={() => navigate('ApplicationDetail', { id: p.id })} />
                        ))
                    )}
                </>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    date: { ...typography.overline, color: colors.primary, marginTop: spacing.md },
    hello: { ...typography.display, color: colors.text, marginTop: spacing.xs },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
    cta: { marginBottom: spacing.lg },
    stats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
    setup: { backgroundColor: colors.midnight, borderColor: colors.midnight, padding: spacing.xl },
    setupIcon: {
        width: 52,
        height: 52,
        borderRadius: radius.lg,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    setupTitle: { ...typography.h2, color: colors.white, marginTop: spacing.lg },
    setupText: { fontSize: 14, color: '#C9D3F5', marginTop: spacing.sm, lineHeight: 20 },
    setupButton: { marginTop: spacing.lg, alignSelf: 'flex-start' }
});
