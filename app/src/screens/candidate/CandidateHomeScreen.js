import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ErrorState, LoadingState, Screen, SectionHeader, StatCard, EmptyState } from '../../components/ui';
import JobCard from '../../components/jobs/JobCard';
import ApplicationCard from '../../components/applications/ApplicationCard';
import CompletenessCard, { computeCompleteness } from '../../components/profile/CompletenessCard';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { jobsService } from '../../services/jobs.service';
import { applicationsService } from '../../services/applications.service';
import { curriculumsService } from '../../services/users.service';
import { skillsService } from '../../services/skills.service';
import { documentsService } from '../../services/documents.service';
import { colors, radius, shadow, spacing, typography } from '../../theme';
import { ACTIVE_APPLICATION_STATUS } from '../../constants/options';
import { firstName, todayLabel } from '../../utils/format';

// Ordena las ofertas según cuántas de mis habilidades aparecen en ellas
const recomendar = (ofertas, habilidades) => {
    const nombres = habilidades.map((h) => h.skill_name.toLowerCase());
    return ofertas
        .map((o) => {
            const texto = `${o.job_title} ${o.requirements || ''} ${o.description || ''}`.toLowerCase();
            return { oferta: o, puntos: nombres.filter((n) => texto.includes(n)).length };
        })
        .sort((a, b) => b.puntos - a.puntos)
        .map((r) => r.oferta);
};

export default function CandidateHomeScreen() {
    const { user } = useAuth();
    const { navigate, goToTab } = useNavigation();

    const { data, loading, error, refreshing, refresh, reload } = useApi(async () => {
        const [ofertas, postulaciones, curriculum, habilidades, documentos] = await Promise.all([
            jobsService.list(),
            applicationsService.mine(),
            curriculumsService.mine(),
            skillsService.list(),
            documentsService.mine()
        ]);
        return { ofertas, postulaciones, curriculum, habilidades, documentos };
    });

    if (loading) return <Screen><LoadingState message="Preparando tu espacio…" /></Screen>;
    if (error) return <Screen><ErrorState message={error} onRetry={reload} /></Screen>;

    const { ofertas, postulaciones, curriculum, habilidades, documentos } = data;
    const activas = postulaciones.filter((p) => ACTIVE_APPLICATION_STATUS.includes(p.application_status));
    const entrevistas = postulaciones.filter((p) => p.application_status === 'interview');
    const completitud = computeCompleteness({ user, curriculum, skills: habilidades, documents: documentos });
    const recomendadas = recomendar(ofertas, habilidades).slice(0, 3);

    return (
        <Screen refreshing={refreshing} onRefresh={refresh}>
            <Text style={styles.date}>{todayLabel()}</Text>
            <Text style={styles.hello}>Hola, {firstName(user?.full_name)}</Text>
            <Text style={styles.subtitle}>
                {activas.length ? `Tienes ${activas.length} ${activas.length === 1 ? 'proceso activo' : 'procesos activos'}. ¡Sigue así!` : 'Tu próxima oportunidad te está esperando.'}
            </Text>

            <Pressable onPress={() => goToTab(1)} style={({ pressed }) => [styles.search, pressed && styles.pressed]}>
                <Ionicons name="search" size={20} color={colors.white} />
                <Text style={styles.searchText}>Buscar oportunidades</Text>
            </Pressable>

            <CompletenessCard
                percent={completitud.percent}
                missing={completitud.missing}
                onPress={() => navigate('EditProfile')}
            />

            <View style={styles.stats}>
                <StatCard icon="briefcase-outline" label="Postulaciones activas" value={activas.length} tone="primary" onPress={() => goToTab(2)} />
                <StatCard icon="chatbubbles-outline" label="En entrevista" value={entrevistas.length} tone="turquoise" onPress={() => goToTab(2)} />
            </View>
            <View style={styles.stats}>
                <StatCard icon="layers-outline" label="Ofertas disponibles" value={ofertas.length} tone="violet" onPress={() => goToTab(1)} />
                <StatCard icon="sparkles-outline" label="Habilidades registradas" value={habilidades.length} tone="warning" onPress={() => navigate('Skills')} />
            </View>

            <SectionHeader eyebrow="Según tus habilidades" title="Recomendadas para ti" actionLabel="Ver todas" onAction={() => goToTab(1)} />
            {recomendadas.length === 0 ? (
                <EmptyState icon="briefcase-outline" title="Aún no hay ofertas publicadas" message="Vuelve pronto: las empresas publican nuevas vacantes cada semana." />
            ) : (
                recomendadas.map((oferta) => (
                    <JobCard key={oferta.id} job={oferta} onPress={() => navigate('JobDetail', { id: oferta.id })} />
                ))
            )}

            {postulaciones.length > 0 && (
                <>
                    <SectionHeader eyebrow="Seguimiento" title="Tus procesos" actionLabel="Ver todos" onAction={() => goToTab(2)} />
                    {postulaciones.slice(0, 2).map((p) => (
                        <ApplicationCard key={p.id} application={p} onPress={() => navigate('ApplicationDetail', { id: p.id })} />
                    ))}
                </>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    date: { ...typography.overline, color: colors.primary, marginTop: spacing.md },
    hello: { ...typography.display, color: colors.text, marginTop: spacing.xs },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        height: 54,
        borderRadius: radius.lg,
        backgroundColor: colors.primary,
        marginBottom: spacing.lg,
        ...shadow.raised
    },
    searchText: { color: colors.white, fontSize: 16, fontWeight: '700' },
    pressed: { opacity: 0.88 },
    stats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md }
});
