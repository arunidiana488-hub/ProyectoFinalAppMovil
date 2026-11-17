import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppButton, AppHeader, Card, EmptyState, ErrorState, HeaderIconButton, LoadingState, Screen } from '../../components/ui';
import SkillItem from '../../components/skills/SkillItem';
import SkillForm from '../../components/skills/SkillForm';
import { useToast } from '../../context/ToastContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { useApi } from '../../hooks/useApi';
import { skillsService } from '../../services/skills.service';
import { colors, spacing } from '../../theme';
import { SKILL_LEVELS } from '../../constants/options';

const ORDEN = Object.fromEntries(SKILL_LEVELS.map((n) => [n.value, n.step]));

// Gestión de habilidades del candidato (CRUD de /api/skills)
export default function SkillsScreen() {
    const { goBack } = useNavigation();
    const toast = useToast();
    const [formulario, setFormulario] = useState({ visible: false, skill: null });
    const [guardando, setGuardando] = useState(false);

    const { data, setData, loading, error, refreshing, refresh, reload } = useApi(() => skillsService.list());

    const abrir = (skill = null) => setFormulario({ visible: true, skill });
    const cerrar = () => setFormulario({ visible: false, skill: null });

    const guardar = async (datos) => {
        setGuardando(true);
        try {
            if (formulario.skill) {
                const actualizada = await skillsService.update(formulario.skill.id, datos);
                setData((lista) => lista.map((h) => (h.id === actualizada.id ? actualizada : h)));
                toast('Habilidad actualizada');
            } else {
                const nueva = await skillsService.create(datos);
                setData((lista) => [...lista, nueva]);
                toast('Habilidad agregada');
            }
            cerrar();
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setGuardando(false);
        }
    };

    const eliminar = (skill) =>
        Alert.alert('Eliminar habilidad', `¿Quitar «${skill.skill_name}» de tu perfil?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await skillsService.remove(skill.id);
                        setData((lista) => lista.filter((h) => h.id !== skill.id));
                        toast('Habilidad eliminada');
                    } catch (e) {
                        toast(e.message, 'error');
                    }
                }
            }
        ]);

    const header = (
        <AppHeader
            title="Mis habilidades"
            subtitle="Ordenadas por nivel"
            onBack={goBack}
            right={<HeaderIconButton icon="add" tone="primary" label="Agregar habilidad" onPress={() => abrir()} />}
        />
    );

    const lista = [...(data || [])].sort((a, b) => (ORDEN[b.level] || 0) - (ORDEN[a.level] || 0));
    const avanzadas = lista.filter((h) => h.level === 'advanced').length;

    return (
        <Screen header={header} refreshing={refreshing} onRefresh={refresh}>
            {loading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState message={error} onRetry={reload} />
            ) : lista.length === 0 ? (
                <EmptyState
                    icon="sparkles-outline"
                    title="Agrega tu primera habilidad"
                    message="Tecnologías, herramientas, idiomas o habilidades blandas: las empresas buscan por ellas."
                    actionLabel="Agregar habilidad"
                    onAction={() => abrir()}
                />
            ) : (
                <>
                    <View style={styles.summary}>
                        <Text style={styles.summaryText}>
                            {lista.length} habilidades · {avanzadas} en nivel avanzado
                        </Text>
                    </View>
                    <Card>
                        {lista.map((h) => (
                            <SkillItem key={h.id} skill={h} onEdit={abrir} onDelete={eliminar} />
                        ))}
                    </Card>
                    <AppButton title="Agregar otra habilidad" variant="secondary" icon="add" onPress={() => abrir()} full />
                </>
            )}

            <SkillForm
                visible={formulario.visible}
                skill={formulario.skill}
                onClose={cerrar}
                onSubmit={guardar}
                submitting={guardando}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    summary: { marginBottom: spacing.md },
    summaryText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary }
});
