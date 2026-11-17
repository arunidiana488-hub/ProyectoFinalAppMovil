import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadow, spacing } from '../theme';

const ToastContext = createContext(null);

const ESTILOS = {
    success: { icon: 'checkmark-circle', color: colors.turquoise },
    error: { icon: 'alert-circle', color: '#FF7A7A' },
    info: { icon: 'information-circle', color: '#8EA6FF' }
};

// Mensajes cortos de confirmación ("Oferta publicada", "Error al guardar"…)
export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const opacity = useRef(new Animated.Value(0)).current;
    const timer = useRef(null);
    const insets = useSafeAreaInsets();

    const show = useCallback((message, type = 'success') => {
        clearTimeout(timer.current);
        setToast({ message, type });
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
        timer.current = setTimeout(() => {
            Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
        }, 2800);
    }, [opacity]);

    const estilo = ESTILOS[toast?.type] || ESTILOS.info;

    return (
        <ToastContext.Provider value={show}>
            {children}
            {toast && (
                <Animated.View
                    pointerEvents="none"
                    style={[styles.wrapper, { bottom: insets.bottom + 88, opacity }]}
                >
                    <View style={styles.toast}>
                        <Ionicons name={estilo.icon} size={20} color={estilo.color} />
                        <Text style={styles.text}>{toast.message}</Text>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const show = useContext(ToastContext);
    if (!show) throw new Error('useToast debe usarse dentro de ToastProvider');
    return show;
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: spacing.lg,
        right: spacing.lg,
        alignItems: 'center'
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.midnight,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        maxWidth: '100%',
        ...shadow.raised
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
        flexShrink: 1
    }
});
