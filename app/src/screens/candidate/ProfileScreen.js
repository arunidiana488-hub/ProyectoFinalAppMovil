import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppButton, Card, ErrorState, LoadingState, Screen, SectionHeader, EmptyState } from '../../components/ui';
import ProfileHeader from '../../components/profile/ProfileHeader';
import CvSection from '../../components/profile/CvSection';
import CompletenessCard, { computeCompleteness } from '../../components/profile/CompletenessCard';
import SkillItem from '../../components/skills/SkillItem';
import DocumentItem from '../../components/documents/DocumentItem';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { curriculumsService } from '../../services/users.service';
import { skillsService } from '../../services/skills.service';
import { documentsService } from '../../services/documents.service';
import { colors, spacing } from '../../theme';

// Mi perfil profesional (candidato): currículum, habilidades y documentos
export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { navigate } = useNavigation();

    const { data, loading, error, refreshing, refresh, reload } = useApi(async () => {
        const [curriculum, habilidades, documentos] = await Promise.all([
            curriculumsService.mine(),
            skillsService.list(),
            documentsService.mine()
        ]);
        return { curriculum, habilidades, documentos };
    });

    const salir = () =>
        Alert.alert('Cerrar sesión', '¿Quieres salir de tu cuenta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: logout }
        ]);

    if (loading) return <Screen><LoadingState /></Screen>;
    if (error) return <Screen><ErrorState message={error} onRetry={reload} /></Screen>;

    const { curriculum, habilidades, documentos } = data;
    const completitud = computeCompleteness({ user, curriculum, skills: habilidades, documents: documentos });

    return (
        <Screen refreshing={refreshing} onRefresh={refresh}>
            <ProfileHeader user={user} title={curriculum?.title}>
                <AppButton
                    title="Editar perfil y CV"
                    variant="light"
                    size="sm"
                    icon="create-outline"
                    onPress={() => navigate('EditProfile')}
                    style={styles.editButton}
                />
            </ProfileHeader>

            <CompletenessCard percent={completitud.percent} missing={completitud.missing} />

            <SectionHeader eyebrow="Currículum" title="Mi información profesional" />
            <CvSection icon="person-circle-outline" title="Resumen profesional" content={curriculum?.description} emptyText="Cuéntale a las empresas quién eres en 2 o 3 líneas." />
            <CvSection icon="briefcase-outline" title="Experiencia laboral" content={curriculum?.experience} emptyText="Agrega tus trabajos: cargo · empresa (años)." />
            <CvSection icon="school-outline" title="Estudios" content={curriculum?.education} emptyText="Agrega tu carrera, institución y años." />
            <CvSection icon="language-outline" title="Idiomas" content={curriculum?.languages} emptyText="Ej. Español (nativo), Inglés (B2)." />

            <SectionHeader eyebrow="Competencias" title={`Habilidades (${habilidades.length})`} actionLabel="Gestionar" onAction={() => navigate('Skills')} />
            <Card>
                {habilidades.length === 0 ? (
                    <EmptyState icon="sparkles-outline" title="Sin habilidades todavía" message="Las empresas filtran candidatos por habilidades." actionLabel="Agregar habilidades" onAction={() => navigate('Skills')} />
                ) : (
                    habilidades.slice(0, 6).map((h) => <SkillItem key={h.id} skill={h} readOnly />)
                )}
                {habilidades.length > 6 && (
                    <Text style={styles.more}>y {habilidades.length - 6} más…</Text>
                )}
            </Card>

            <SectionHeader eyebrow="Respaldo" title={`Títulos y certificados (${documentos.length})`} actionLabel="Gestionar" onAction={() => navigate('Documents')} />
            {documentos.length === 0 ? (
                <Card>
                    <EmptyState icon="ribbon-outline" title="Sin documentos" message="Registra tus títulos para que un administrador los verifique." actionLabel="Registrar documento" onAction={() => navigate('Documents')} />
                </Card>
            ) : (
                documentos.slice(0, 2).map((d) => <DocumentItem key={d.id} document={d} />)
            )}

            <View style={styles.logout}>
                <AppButton title="Cerrar sesión" variant="outline" icon="log-out-outline" onPress={salir} full />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    editButton: { marginTop: spacing.lg, alignSelf: 'flex-start' },
    more: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.md, textAlign: 'center' },
    logout: { marginTop: spacing.xl }
});
