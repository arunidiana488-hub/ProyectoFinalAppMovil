import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Carga datos de la API y maneja los estados de carga, error y "jalar para actualizar".
 *
 *   const { data, loading, error, refreshing, refresh, reload } = useApi(() => jobsService.list(filtros), [filtros]);
 */
export function useApi(loader, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const mounted = useRef(true);
    const loaderRef = useRef(loader);
    loaderRef.current = loader;

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const run = useCallback(async (modo = 'load') => {
        if (modo === 'refresh') setRefreshing(true);
        else if (modo === 'load') setLoading(true);
        setError(null);
        try {
            const resultado = await loaderRef.current();
            if (mounted.current) setData(resultado);
        } catch (e) {
            if (mounted.current) setError(e?.message || 'Ocurrió un error inesperado');
        } finally {
            if (mounted.current) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        run('load');
    }, deps);

    return {
        data,
        setData,
        loading,
        refreshing,
        error,
        reload: () => run('load'),
        refresh: () => run('refresh'),
        silentReload: () => run('silent')
    };
}

// Espera a que el usuario deje de escribir antes de buscar
export function useDebounce(valor, ms = 400) {
    const [debounced, setDebounced] = useState(valor);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(valor), ms);
        return () => clearTimeout(t);
    }, [valor, ms]);
    return debounced;
}
