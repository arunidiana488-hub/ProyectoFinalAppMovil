import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BackHandler } from 'react-native';

const NavigationContext = createContext(null);

/**
 * Navegación propia y liviana (sin librerías externas):
 * - tab: pestaña activa del menú inferior
 * - stack: pantallas abiertas encima de las pestañas (detalle, formularios…)
 * El botón "Atrás" de Android cierra la última pantalla abierta.
 */
export function NavigationProvider({ children }) {
    const [tab, setTab] = useState(0);
    const [stack, setStack] = useState([]);

    const navigate = useCallback((name, params = {}) => {
        setStack((actual) => [...actual, { name, params, key: `${name}-${Date.now()}` }]);
    }, []);

    const goBack = useCallback(() => {
        setStack((actual) => actual.slice(0, -1));
    }, []);

    const replace = useCallback((name, params = {}) => {
        setStack((actual) => [...actual.slice(0, -1), { name, params, key: `${name}-${Date.now()}` }]);
    }, []);

    const goToTab = useCallback((index) => {
        setStack([]);
        setTab(index);
    }, []);

    useEffect(() => {
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (stack.length > 0) {
                goBack();
                return true;
            }
            if (tab !== 0) {
                setTab(0);
                return true;
            }
            return false;
        });
        return () => sub.remove();
    }, [stack.length, tab, goBack]);

    const value = useMemo(
        () => ({ tab, stack, navigate, goBack, replace, goToTab, canGoBack: stack.length > 0 }),
        [tab, stack, navigate, goBack, replace, goToTab]
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export const useNavigation = () => {
    const contexto = useContext(NavigationContext);
    if (!contexto) throw new Error('useNavigation debe usarse dentro de NavigationProvider');
    return contexto;
};
