import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />
            <ToastProvider>
                <AuthProvider>
                    <AppNavigator />
                </AuthProvider>
            </ToastProvider>
        </SafeAreaProvider>
    );
}
