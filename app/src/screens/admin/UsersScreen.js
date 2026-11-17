import { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader, ChipSelect, EmptyState, ErrorState, LoadingState, Screen, SearchBar } from '../../components/ui';
import UserRow from '../../components/admin/UserRow';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi, useDebounce } from '../../hooks/useApi';
import { usersService } from '../../services/users.service';
import { colors, spacing } from '../../theme';
import { ACCOUNT_STATUS, ROLES } from '../../constants/options';

// Gestión de usuarios: filtrar por rol y estado, activar o suspender cuentas
export default function UsersScreen() {
    const { user: yo } = useAuth();
    const { navigate } = useNavigation();
    const toast = useToast();
    const [rol, setRol] = useState('');
    const [estado, setEstado] = useState('');
    const [texto, setTexto] = useState('');
    const [cambiando, setCambiando] = useState(null);
    const q = useDebounce(texto.trim(), 400);

    const { data, setData, loading, error, refreshing, refresh, reload } = useApi(
        () => usersService.list({ role: rol, status: estado, q }),
        [rol, estado, q]
    );

    const alternar = (usuario) => {
        const nuevo = usuario.account_status === 'active' ? 'suspended' : 'active';
        Alert.alert(
            nuevo === 'suspended' ? 'Suspender cuenta' : 'Activar cuenta',
            `${usuario.full_name} ${nuevo === 'suspended' ? 'no podrá iniciar sesión' : 'podrá volver a ingresar'}.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    style: nuevo === 'suspended' ? 'destructive' : 'default',
                    onPress: async () => {
                        setCambiando(usuario.id);
                        try {
                            const actualizado = await usersService.setStatus(usuario.id, nuevo);
                            setData((lista) => lista.map((u) => (u.id === usuario.id ? { ...u, ...actualizado } : u)));
                            toast(nuevo === 'active' ? 'Cuenta activada' : 'Cuenta suspendida');
                        } catch (e) {
                            toast(e.message, 'error');
                        } finally {
                            setCambiando(null);
                        }
                    }
                }
            ]
        );
    };

    return (
        <Screen scroll={false} padded={false} header={<AppHeader eyebrow="Comunidad" title="Usuarios" />}>
            <FlatList
                data={loading || error ? [] : data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <UserRow
                        user={item}
                        isSelf={item.id === yo?.id}
                        loading={cambiando === item.id}
                        onToggle={alternar}
                        onPress={() => navigate('CandidateProfile', { id: item.id })}
                    />
                )}
                ListHeaderComponent={
                    <View>
                        <SearchBar value={texto} onChangeText={setTexto} placeholder="Nombre o correo" />
                        <ChipSelect options={ROLES} allLabel="Todos los roles" value={rol} onChange={setRol} style={styles.filter} />
                        <ChipSelect options={ACCOUNT_STATUS} allLabel="Todos los estados" value={estado} onChange={setEstado} />
                        {!loading && !error && <Text style={styles.count}>{data.length} usuarios</Text>}
                    </View>
                }
                ListEmptyComponent={
                    loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={reload} /> : <EmptyState icon="people-outline" title="Sin usuarios con estos filtros" />
                }
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl * 2 },
    filter: { marginBottom: spacing.sm },
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md }
});
