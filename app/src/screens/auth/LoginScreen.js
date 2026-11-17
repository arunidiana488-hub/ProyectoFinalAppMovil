import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton, Card, Logo, Screen, TextField } from '../../components/ui';
import ServerSettingsSheet from '../../components/auth/ServerSettingsSheet';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { colors, radius, spacing, typography } from '../../theme';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../config/env';
import { isEmail } from '../../utils/validation';

export default function LoginScreen() {
    const { login, apiUrl, changeApiUrl } = useAuth();
    const { navigate } = useNavigation();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(null); // 'form' o el correo de la cuenta demo
    const [servidor, setServidor] = useState(false);

    const ingresar = async (correo, clave, origen = 'form') => {
        setCargando(origen);
        try {
            const usuario = await login(correo, clave);
            toast(`Bienvenido, ${usuario.full_name.split(' ')[0]}`);
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setCargando(null);
        }
    };

    const enviar = () => {
        const e = {};
        if (!isEmail(email)) e.email = 'Escribe un correo válido';
        if (!password) e.password = 'Escribe tu contraseña';
        setErrores(e);
        if (Object.keys(e).length === 0) ingresar(email, password);
    };

    return (
        <Screen padded={false} edges={['top', 'bottom']}>
            <View style={styles.hero}>
                <View style={styles.glowBlue} />
                <View style={styles.glowTurquoise} />
                <Logo light size={42} />
                <Text style={styles.headline}>Tu próxima gran oportunidad comienza aquí.</Text>
                <Text style={styles.lead}>
                    Conectamos el talento boliviano con empresas que están construyendo el futuro.
                </Text>
            </View>

            <View style={styles.body}>
                <Card style={styles.card}>
                    <Text style={styles.eyebrow}>Bienvenido de nuevo</Text>
                    <Text style={styles.title}>Ingresa a tu espacio</Text>

                    <TextField
                        label="Correo electrónico"
                        icon="mail-outline"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="nombre@correo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errores.email}
                    />
                    <TextField
                        label="Contraseña"
                        icon="lock-closed-outline"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Tu contraseña"
                        secureTextEntry
                        autoCapitalize="none"
                        error={errores.password}
                        onSubmitEditing={enviar}
                    />
                    <AppButton title="Ingresar" onPress={enviar} loading={cargando === 'form'} disabled={!!cargando} full />

                    <View style={styles.registerRow}>
                        <Text style={styles.muted}>¿Aún no tienes cuenta?</Text>
                        <Pressable onPress={() => navigate('Register')} hitSlop={8}>
                            <Text style={styles.link}>Crear cuenta</Text>
                        </Pressable>
                    </View>
                </Card>

                <View style={styles.separator}>
                    <View style={styles.line} />
                    <Text style={styles.separatorText}>o prueba la plataforma</Text>
                    <View style={styles.line} />
                </View>

                {DEMO_ACCOUNTS.map((cuenta) => (
                    <Card key={cuenta.email} onPress={() => ingresar(cuenta.email, DEMO_PASSWORD, cuenta.email)} style={styles.demo}>
                        <View style={styles.demoRow}>
                            <View style={styles.demoIcon}>
                                <Ionicons name={cuenta.icon} size={20} color={colors.primary} />
                            </View>
                            <View style={styles.flex}>
                                <Text style={styles.demoName}>{cuenta.label}</Text>
                                <Text style={styles.demoDetail}>{cuenta.detail}</Text>
                            </View>
                            {cargando === cuenta.email ? (
                                <Text style={styles.link}>Ingresando…</Text>
                            ) : (
                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                            )}
                        </View>
                    </Card>
                ))}

                <Pressable onPress={() => setServidor(true)} style={styles.server} hitSlop={8}>
                    <Ionicons name="server-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.serverText} numberOfLines={1}>Servidor: {apiUrl}</Text>
                    <Text style={styles.link}>Cambiar</Text>
                </Pressable>
            </View>

            <ServerSettingsSheet
                visible={servidor}
                currentUrl={apiUrl}
                onClose={() => setServidor(false)}
                onSave={async (url) => {
                    await changeApiUrl(url);
                    setServidor(false);
                    toast('Servidor actualizado');
                }}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    hero: {
        backgroundColor: colors.midnight,
        paddingHorizontal: spacing.xxl,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxxl * 2,
        overflow: 'hidden'
    },
    glowBlue: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: colors.primary,
        opacity: 0.4,
        right: -90,
        top: -80
    },
    glowTurquoise: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.turquoise,
        opacity: 0.18,
        left: -50,
        bottom: -60
    },
    headline: { ...typography.display, color: colors.white, marginTop: spacing.xxl },
    lead: { fontSize: 15, lineHeight: 22, color: '#C9D3F5', marginTop: spacing.md },
    body: { paddingHorizontal: spacing.xl, marginTop: -spacing.xxxl - spacing.lg },
    card: { padding: spacing.xl },
    eyebrow: { ...typography.overline, color: colors.primary },
    title: { ...typography.h2, color: colors.text, marginTop: 2, marginBottom: spacing.xl },
    registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
    muted: { fontSize: 14, color: colors.textSecondary },
    link: { fontSize: 14, fontWeight: '700', color: colors.primary },
    separator: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.lg },
    line: { flex: 1, height: 1, backgroundColor: colors.border },
    separatorText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
    demo: { paddingVertical: spacing.md },
    demoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    demoIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.md,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center'
    },
    flex: { flex: 1 },
    demoName: { fontSize: 15, fontWeight: '700', color: colors.text },
    demoDetail: { fontSize: 12, color: colors.textSecondary },
    server: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: spacing.lg,
        paddingHorizontal: spacing.lg
    },
    serverText: { fontSize: 12, color: colors.textSecondary, flexShrink: 1 }
});
