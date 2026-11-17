import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppHeader, Avatar, Card, ErrorState, LoadingState, Screen, TextField } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { curriculumsService, usersService } from '../../services/users.service';
import { colors, spacing, typography } from '../../theme';
import { cleanText } from '../../utils/validation';

// Editar datos personales (PUT /api/users/me) y currículum (PUT /api/curriculums/me)
export default function EditProfileScreen() {
    const { user, refreshUser } = useAuth();
    const { goBack } = useNavigation();
    const toast = useToast();
    const insets = useSafeAreaInsets();
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState(null);
    const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

    const { data: curriculum, loading, error: errorCarga, reload } = useApi(() => curriculumsService.mine());

    useEffect(() => {
        if (!loading && !errorCarga) {
            setForm({
                full_name: user?.full_name || '',
                phone: user?.phone || '',
                profile_photo: user?.profile_photo || '',
                title: curriculum?.title || '',
                description: curriculum?.description || '',
                experience: curriculum?.experience || '',
                education: curriculum?.education || '',
                languages: curriculum?.languages || ''
            });
        }
    }, [loading, errorCarga, curriculum]);

    const guardar = async () => {
        if (form.full_name.trim().length < 3) {
            setError('Escribe tu nombre completo');
            return;
        }
        setError('');
        setGuardando(true);
        try {
            await usersService.updateMe({
                full_name: form.full_name.trim(),
                phone: cleanText(form.phone),
                profile_photo: cleanText(form.profile_photo)
            });
            await curriculumsService.saveMine({
                title: cleanText(form.title),
                description: cleanText(form.description),
                experience: cleanText(form.experience),
                education: cleanText(form.education),
                languages: cleanText(form.languages)
            });
            await refreshUser();
            toast('Tu perfil y tu CV fueron actualizados');
            goBack();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const header = <AppHeader title="Editar perfil" subtitle="Esta información verán las empresas" onBack={goBack} />;

    if (loading || (!form && !errorCarga)) return <Screen header={header}><LoadingState /></Screen>;
    if (errorCarga) return <Screen header={header}><ErrorState message={errorCarga} onRetry={reload} /></Screen>;

    return (
        <Screen
            header={header}
            footer={
                <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                    <AppButton title="Guardar cambios" icon="checkmark" onPress={guardar} loading={guardando} full />
                </View>
            }
        >
            <Card>
                <View style={styles.photoRow}>
                    <Avatar name={form.full_name} uri={form.profile_photo} size={64} />
                    <Text style={styles.photoHint}>Pega el enlace de una foto profesional (por ejemplo, de tu LinkedIn).</Text>
                </View>
                <Text style={styles.section}>Datos personales</Text>
                <TextField label="Nombre completo" required value={form.full_name} onChangeText={set('full_name')} autoCapitalize="words" error={error} />
                <TextField label="Teléfono" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+591 7…" />
                <TextField label="URL de la foto" value={form.profile_photo} onChangeText={set('profile_photo')} autoCapitalize="none" keyboardType="url" placeholder="https://…" />
            </Card>

            <Card>
                <Text style={styles.section}>Currículum</Text>
                <TextField label="Título profesional" value={form.title} onChangeText={set('title')} placeholder="Ej. Desarrolladora Móvil" />
                <TextField label="Resumen profesional" multiline value={form.description} onChangeText={set('description')} placeholder="Quién eres, qué haces bien y qué buscas" />
                <TextField label="Experiencia laboral" multiline value={form.experience} onChangeText={set('experience')} placeholder="Cargo · Empresa (2023 – Actualidad)" hint="Escribe un trabajo por línea" />
                <TextField label="Estudios" multiline value={form.education} onChangeText={set('education')} placeholder="Carrera · Institución (2018 – 2023)" hint="Un estudio por línea" />
                <TextField label="Idiomas" value={form.languages} onChangeText={set('languages')} placeholder="Español (nativo), Inglés (B2)" />
            </Card>
        </Screen>
    );
}

const styles = StyleSheet.create({
    photoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.lg },
    photoHint: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
    section: { ...typography.overline, color: colors.primary, marginBottom: spacing.md },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border
    }
});
