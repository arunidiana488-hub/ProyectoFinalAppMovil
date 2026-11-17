import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppHeader, Badge, Card, EmptyState, ErrorState, LoadingState, Screen, SectionHeader } from '../../components/ui';
import ProfileHeader from '../../components/profile/ProfileHeader';
import CvSection from '../../components/profile/CvSection';
import SkillItem from '../../components/skills/SkillItem';
import DocumentItem from '../../components/documents/DocumentItem';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { usersService } from '../../services/users.service';
import { colors, spacing } from '../../theme';
import { ACCOUNT_STATUS, ROLES, labelOf, optionOf } from '../../constants/options';
import { formatDate } from '../../utils/format';

// Perfil completo de un candidato visto por una empresa o por el administrador (GET /api/users/:id)
export default function CandidateProfileScreen({ params }) {
    const { user } = useAuth();
    const { goBack } = useNavigation();
    const toast = useToast();
    const [cambiando, setCambiando] = useState(false);
    const esAdmin = user?.role === 'administrator';

    const { data: perfil, setData, loading, error, reload } = useApi(() => usersService.get(params.id), [params.id]);
    const header = <AppHeader title="Perfil del candidato" onBack={goBack} />;

    if (loading) return <Screen header={header}><LoadingState /></Screen>;
    if (error) return <Screen header={header}><ErrorState message={error} onRetry={reload} /></Screen>;

    const cv = Array.isArray(perfil.curriculum) ? perfil.curriculum[0] : perfil.curriculum;
    const habilidades = perfil.skills || [];
    const documentos = perfil.documentos || [];
    const estado = optionOf(ACCOUNT_STATUS, perfil.account_status) || ACCOUNT_STATUS[0];

    const cambiarEstado = () => {
        const nuevo = perfil.account_status === 'active' ? 'suspended' : 'active';
        Alert.alert(
            nuevo === 'suspended' ? 'Suspender cuenta' : 'Activar cuenta',
            nuevo === 'suspended' ? 'El usuario no podrá iniciar sesión.' : 'El usuario podrá volver a ingresar.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: nuevo === 'suspended' ? 'destructive' : 'default',
                    onPress: async () => {
                        setCambiando(true);
                        try {
                            const actualizado = await usersService.setStatus(perfil.id, nuevo);
                            setData({ ...perfil, ...actualizado });
                            toast(nuevo === 'active' ? 'Cuenta activada' : 'Cuenta suspendida');
                        } catch (e) {
                            toast(e.message, 'error');
                        } finally {
                            setCambiando(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <Screen header={header}>
            <ProfileHeader user={perfil} title={cv?.title}>
                <View style={styles.badges}>
                    <Badge label={labelOf(ROLES, perfil.role)} tone="primary" />
                    {esAdmin && <Badge label={estado.label} tone={estado.tone} />}
                    <Badge label={`Miembro desde ${formatDate(perfil.created_at)}`} tone="neutral" />
                </View>
            </ProfileHeader>

            {esAdmin && perfil.id !== user.id && (
                <AppButton
                    title={perfil.account_status === 'active' ? 'Suspender cuenta' : 'Activar cuenta'}
                    variant={perfil.account_status === 'active' ? 'danger' : 'secondary'}
                    icon={perfil.account_status === 'active' ? 'ban-outline' : 'checkmark-circle-outline'}
                    onPress={cambiarEstado}
                    loading={cambiando}
                    full
                    style={styles.adminAction}
                />
            )}

            {perfil.role === 'candidate' && (
                <>
                    <CvSection icon="person-circle-outline" title="Resumen profesional" content={cv?.description} />
                    <CvSection icon="briefcase-outline" title="Experiencia laboral" content={cv?.experience} />
                    <CvSection icon="school-outline" title="Estudios" content={cv?.education} />
                    <CvSection icon="language-outline" title="Idiomas" content={cv?.languages} />

                    <SectionHeader eyebrow="Competencias" title={`Habilidades (${habilidades.length})`} />
                    <Card>
                        {habilidades.length === 0 ? (
                            <Text style={styles.empty}>El candidato aún no registró habilidades.</Text>
                        ) : (
                            habilidades.map((h) => <SkillItem key={h.id} skill={h} readOnly />)
                        )}
                    </Card>

                    <SectionHeader eyebrow="Respaldo" title={`Títulos y certificados (${documentos.length})`} />
                    {documentos.length === 0 ? (
                        <Card>
                            <EmptyState icon="ribbon-outline" title="Sin documentos registrados" />
                        </Card>
                    ) : (
                        documentos.map((d) => <DocumentItem key={d.id} document={d} />)
                    )}
                </>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
    adminAction: { marginBottom: spacing.lg },
    empty: { fontSize: 14, color: colors.textSecondary }
});
