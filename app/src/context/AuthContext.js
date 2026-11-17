import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authService } from '../services/auth.service';
import { setApiBaseUrl, getApiBaseUrl, setAuthToken, setUnauthorizedHandler } from '../services/api';
import { DEFAULT_API_URL } from '../config/env';

const SESSION_KEY = 'talentonova.session';
const API_URL_KEY = 'talentonova.apiUrl';

const AuthContext = createContext(null);

// Guarda la sesión (token + usuario) en el teléfono para no pedir login cada vez
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [booting, setBooting] = useState(true);
    const [apiUrl, setApiUrlState] = useState(DEFAULT_API_URL);

    const guardarSesion = async (token, usuario) => {
        setAuthToken(token);
        setUser(usuario);
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ token, usuario }));
    };

    const logout = useCallback(async () => {
        setAuthToken(null);
        setUser(null);
        await AsyncStorage.removeItem(SESSION_KEY);
    }, []);

    // Al abrir la app: recupera la URL de la API y la sesión guardada
    useEffect(() => {
        setUnauthorizedHandler(() => {
            logout();
        });

        (async () => {
            try {
                const urlGuardada = await AsyncStorage.getItem(API_URL_KEY);
                if (urlGuardada) {
                    setApiBaseUrl(urlGuardada);
                    setApiUrlState(getApiBaseUrl());
                }

                const guardada = await AsyncStorage.getItem(SESSION_KEY);
                if (guardada) {
                    const { token, usuario } = JSON.parse(guardada);
                    setAuthToken(token);
                    setUser(usuario);
                    // Actualiza los datos en segundo plano (si la sesión venció, se cierra sola)
                    authService.me().then(setUser).catch(() => {});
                }
            } catch {
                await AsyncStorage.removeItem(SESSION_KEY);
            } finally {
                setBooting(false);
            }
        })();
    }, [logout]);

    const login = async (email, password) => {
        const { token, usuario } = await authService.login(email.trim().toLowerCase(), password);
        await guardarSesion(token, usuario);
        return usuario;
    };

    const register = async (datos) => {
        const { token, usuario } = await authService.register(datos);
        await guardarSesion(token, usuario);
        return usuario;
    };

    const refreshUser = async () => {
        const usuario = await authService.me();
        setUser(usuario);
        const guardada = await AsyncStorage.getItem(SESSION_KEY);
        if (guardada) {
            const { token } = JSON.parse(guardada);
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ token, usuario }));
        }
        return usuario;
    };

    const changeApiUrl = async (url) => {
        setApiBaseUrl(url);
        setApiUrlState(getApiBaseUrl());
        await AsyncStorage.setItem(API_URL_KEY, getApiBaseUrl());
    };

    const value = useMemo(
        () => ({ user, booting, apiUrl, login, register, logout, refreshUser, changeApiUrl }),
        [user, booting, apiUrl, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return contexto;
};
