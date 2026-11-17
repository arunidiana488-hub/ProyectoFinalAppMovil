import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { NavigationProvider, useNavigation } from './NavigationContext';
import BottomTabs from './BottomTabs';
import { routes } from './routes';
import { tabsByRole } from './tabs';
import LoginScreen from '../screens/auth/LoginScreen';
import { Logo } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../theme';

// Pantalla de carga mientras se recupera la sesión guardada
function SplashScreen() {
    return (
        <View style={styles.splash}>
            <Logo size={54} light />
            <ActivityIndicator color={colors.turquoise} style={styles.spinner} />
            <Text style={styles.splashText}>Conectando talento con oportunidades</Text>
        </View>
    );
}

// Muestra la pantalla de encima (si hay) o la pestaña activa con su menú
function Navigator() {
    const { user } = useAuth();
    const { stack, tab, goToTab } = useNavigation();
    const actual = stack[stack.length - 1];

    if (actual) {
        const Pantalla = routes[actual.name];
        if (Pantalla) return <Pantalla key={actual.key} params={actual.params} />;
    }

    if (!user) return <LoginScreen />;

    const tabs = tabsByRole[user.role] || tabsByRole.candidate;
    const indice = Math.min(tab, tabs.length - 1);
    const Pestana = tabs[indice].component;

    return (
        <View style={styles.flex}>
            <View style={styles.flex}>
                <Pestana key={tabs[indice].key} />
            </View>
            <BottomTabs tabs={tabs} active={indice} onChange={goToTab} />
        </View>
    );
}

export default function AppNavigator() {
    const { user, booting } = useAuth();
    if (booting) return <SplashScreen />;

    // La "key" reinicia la navegación cuando alguien inicia o cierra sesión
    return (
        <NavigationProvider key={user ? `${user.id}-${user.role}` : 'invitado'}>
            <Navigator />
        </NavigationProvider>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    splash: { flex: 1, backgroundColor: colors.midnight, alignItems: 'center', justifyContent: 'center' },
    spinner: { marginTop: spacing.xxl },
    splashText: { color: '#C9D3F5', fontSize: 14, marginTop: spacing.md }
});
