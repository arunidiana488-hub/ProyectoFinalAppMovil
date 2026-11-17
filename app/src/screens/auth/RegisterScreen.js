import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, AppHeader, Card, Screen, TextField } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { colors, radius, spacing } from '../../theme';
import { isEmail } from '../../utils/validation';

const TIPOS = [
    { value: 'candidate', label: 'Profesional', detail: 'Busco empleo', icon: 'person-outline' },
    { value: 'recruiter', label: 'Empresa', detail: 'Quiero contratar', icon: 'business-outline' }
];

export default function RegisterScreen() {
    const { register } = useAuth();
    const { goBack } = useNavigation();
    const toast = useToast();

    const [rol, setRol] = useState('candidate');
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
    const [acepta, setAcepta] = useState(false);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

    const crear = async () => {
        const e = {};
        if (form.full_name.trim().length < 3) e.full_name = 'Escribe tu nombre completo';
        if (!isEmail(form.email)) e.email = 'Escribe un correo válido';
        if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
        if (form.confirm !== form.password) e.confirm = 'Las contraseñas no coinciden';
        if (!acepta) e.acepta = 'Debes aceptar los términos para continuar';
        setErrores(e);
        if (Object.keys(e).length) return;

        setCargando(true);
        try {
            const usuario = await register({
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim() || undefined,
                password: form.password,
                role: rol
            });
            toast(rol === 'recruiter' ? 'Cuenta creada. Ahora registra tu empresa.' : `¡Bienvenido, ${usuario.full_name.split(' ')[0]}!`);
        } catch (err) {
            toast(err.message, 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <Screen header={<AppHeader title="Crea tu cuenta" subtitle="Únete a Talento Nova en menos de un minuto" onBack={goBack} />}>
            <Text style={styles.label}>¿Cómo usarás Talento Nova?</Text>
            <View style={styles.roles}>
                {TIPOS.map((tipo) => {
                    const activo = rol === tipo.value;
                    return (
                        <Pressable
                            key={tipo.value}
                            onPress={() => setRol(tipo.value)}
                            style={[styles.role, activo && styles.roleActive]}
                            accessibilityRole="radio"
                            accessibilityState={{ checked: activo }}
                        >
                            <Ionicons name={tipo.icon} size={24} color={activo ? colors.primary : colors.textSecondary} />
                            <Text style={[styles.roleName, activo && styles.roleNameActive]}>{tipo.label}</Text>
                            <Text style={styles.roleDetail}>{tipo.detail}</Text>
                        </Pressable>
                    );
                })}
            </View>

            <Card style={styles.card}>
                <TextField
                    label={rol === 'candidate' ? 'Nombre completo' : 'Nombre del responsable'}
                    required
                    icon="person-outline"
                    value={form.full_name}
                    onChangeText={set('full_name')}
                    autoCapitalize="words"
                    error={errores.full_name}
                />
                <TextField label="Correo electrónico" required icon="mail-outline" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errores.email} />
                <TextField label="Teléfono" icon="call-outline" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+591 7…" />
                <TextField label="Contraseña" required icon="lock-closed-outline" value={form.password} onChangeText={set('password')} secureTextEntry autoCapitalize="none" hint="Mínimo 8 caracteres" error={errores.password} />
                <TextField label="Confirmar contraseña" required icon="lock-closed-outline" value={form.confirm} onChangeText={set('confirm')} secureTextEntry autoCapitalize="none" error={errores.confirm} />

                <Pressable onPress={() => setAcepta(!acepta)} style={styles.terms} accessibilityRole="checkbox" accessibilityState={{ checked: acepta }}>
                    <Ionicons name={acepta ? 'checkbox' : 'square-outline'} size={22} color={acepta ? colors.primary : colors.textMuted} />
                    <Text style={styles.termsText}>Acepto los términos de uso y la política de privacidad.</Text>
                </Pressable>
                {!!errores.acepta && <Text style={styles.error}>{errores.acepta}</Text>}

                <AppButton title="Crear mi cuenta" onPress={crear} loading={cargando} full style={styles.submit} />
            </Card>

            <Pressable onPress={goBack} style={styles.back}>
                <Text style={styles.muted}>¿Ya tienes cuenta? </Text>
                <Text style={styles.link}>Ingresar</Text>
            </Pressable>
        </Screen>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
    roles: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
    role: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        gap: 4
    },
    roleActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    roleName: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
    roleNameActive: { color: colors.primary },
    roleDetail: { fontSize: 12, color: colors.textSecondary },
    card: { padding: spacing.xl },
    terms: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    termsText: { flex: 1, fontSize: 13, color: colors.textSecondary },
    error: { fontSize: 12, color: colors.danger, marginTop: spacing.xs },
    submit: { marginTop: spacing.xl },
    back: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
    muted: { fontSize: 14, color: colors.textSecondary },
    link: { fontSize: 14, fontWeight: '700', color: colors.primary }
});
