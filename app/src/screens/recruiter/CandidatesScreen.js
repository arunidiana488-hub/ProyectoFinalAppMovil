import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { AppHeader, Avatar, Badge, Card, EmptyState, ErrorState, LoadingState, Screen, SearchBar, TextField } from '../../components/ui';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi, useDebounce } from '../../hooks/useApi';
import { usersService } from '../../services/users.service';
import { colors, spacing, typography } from '../../theme';

// Tarjeta de candidato del buscador de talento
function CandidateCard({ candidate, onPress }) {
    const habilidades = candidate.skills || [];
    return (
        <Card onPress={onPress}>
            <View style={styles.row}>
                <Avatar name={candidate.full_name} uri={candidate.profile_photo} size={52} />
                <View style={styles.flex}>
                    <Text style={styles.name}>{candidate.full_name}</Text>
                    <Text style={styles.title} numberOfLines={1}>{candidate.curriculum?.title || 'Perfil profesional'}</Text>
                </View>
            </View>
            {!!candidate.curriculum?.description && (
                <Text style={styles.bio} numberOfLines={2}>{candidate.curriculum.description}</Text>
            )}
            {habilidades.length > 0 && (
                <View style={styles.badges}>
                    {habilidades.slice(0, 4).map((h) => (
                        <Badge key={h.skill_name} label={h.skill_name} tone={h.level === 'advanced' ? 'turquoise' : 'neutral'} />
                    ))}
                    {habilidades.length > 4 && <Badge label={`+${habilidades.length - 4}`} />}
                </View>
            )}
        </Card>
    );
}

// Buscador de candidatos por nombre, título o habilidad (GET /api/users)
export default function CandidatesScreen() {
    const { navigate } = useNavigation();
    const [texto, setTexto] = useState('');
    const [habilidad, setHabilidad] = useState('');
    const q = useDebounce(texto.trim(), 450);
    const skill = useDebounce(habilidad.trim(), 450);

    const { data, loading, error, refreshing, refresh, reload } = useApi(
        () => usersService.list({ q, skill }),
        [q, skill]
    );

    return (
        <Screen scroll={false} padded={false} header={<AppHeader eyebrow="Talento verificado" title="Candidatos" />}>
            <FlatList
                data={loading || error ? [] : data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CandidateCard candidate={item} onPress={() => navigate('CandidateProfile', { id: item.id })} />}
                ListHeaderComponent={
                    <View>
                        <SearchBar value={texto} onChangeText={setTexto} placeholder="Nombre o profesión" />
                        <TextField icon="sparkles-outline" value={habilidad} onChangeText={setHabilidad} placeholder="Filtrar por habilidad (ej. React)" autoCapitalize="none" />
                        {!loading && !error && <Text style={styles.count}>{data.length} profesionales</Text>}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <LoadingState message="Buscando talento…" />
                    ) : error ? (
                        <ErrorState message={error} onRetry={reload} />
                    ) : (
                        <EmptyState icon="people-outline" title="Sin coincidencias" message="Prueba con otra profesión o habilidad." />
                    )
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
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: spacing.md },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    flex: { flex: 1 },
    name: { ...typography.h3, color: colors.text },
    title: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 2 },
    bio: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginTop: spacing.md },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }
});
