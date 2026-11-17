import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BottomSheet from '../ui/BottomSheet';
import TextField from '../ui/TextField';
import AppButton from '../ui/AppButton';
import { colors, radius, spacing } from '../../theme';
import { authService } from '../../services/auth.service';
import { getApiBaseUrl, setApiBaseUrl } from '../../services/api';

/**
 * Permite cambiar la URL de la API sin reiniciar la app.
 * Útil porque la URL del túnel de Cloudflare cambia cada vez que se abre.
 */
export default function ServerSettingsSheet({ visible, currentUrl, onClose, onSave }) {
    const [url, setUrl] = useState(currentUrl);
    const [estado, setEstado] = useState(null); // { ok, mensaje }
    const [probando, setProbando] = useState(false);

    useEffect(() => {
        if (visible) {
            setUrl(currentUrl);
            setEstado(null);
        }
    }, [visible, currentUrl]);

    const probar = async () => {
        const anterior = getApiBaseUrl();
        setProbando(true);
        setEstado(null);
        try {
            setApiBaseUrl(url);
            await authService.health();
            setEstado({ ok: true, mensaje: 'Conexión correcta con la API' });
        } catch (e) {
            setEstado({ ok: false, mensaje: e.message });
        } finally {
            setApiBaseUrl(anterior);
            setProbando(false);
        }
    };

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Servidor de la API"
            subtitle="Pega la URL pública del túnel o de Render"
            footer={
                <View style={styles.actions}>
                    <AppButton title="Probar" variant="outline" icon="pulse-outline" onPress={probar} loading={probando} style={styles.flex} />
                    <AppButton title="Guardar" onPress={() => onSave(url)} style={styles.flex} />
                </View>
            }
        >
            <TextField
                label="URL de la API"
                value={url}
                onChangeText={setUrl}
                placeholder="https://xxxx.trycloudflare.com"
                autoCapitalize="none"
                keyboardType="url"
                hint="Sin «/» al final. «localhost» no funciona desde el celular."
            />
            {estado && (
                <View style={[styles.result, { backgroundColor: estado.ok ? colors.successSoft : colors.dangerSoft }]}>
                    <Ionicons
                        name={estado.ok ? 'checkmark-circle' : 'alert-circle'}
                        size={18}
                        color={estado.ok ? colors.success : colors.danger}
                    />
                    <Text style={[styles.resultText, { color: estado.ok ? colors.success : colors.danger }]}>{estado.mensaje}</Text>
                </View>
            )}
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    actions: { flexDirection: 'row', gap: spacing.md },
    flex: { flex: 1 },
    result: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.lg
    },
    resultText: { flex: 1, fontSize: 13, fontWeight: '600' }
});
