import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import LevelIndicator from './LevelIndicator';
import { colors, radius, spacing } from '../../theme';

// Una habilidad del perfil con su nivel; con botones de editar y eliminar si no es solo lectura
export default function SkillItem({ skill, onEdit, onDelete, readOnly = false }) {
    return (
        <View style={styles.row}>
            <View style={styles.texts}>
                <Text style={styles.name}>{skill.skill_name}</Text>
                {!!skill.category && <Text style={styles.category}>{skill.category}</Text>}
            </View>
            <LevelIndicator level={skill.level} />
            {!readOnly && (
                <View style={styles.actions}>
                    <Pressable onPress={() => onEdit(skill)} hitSlop={8} style={styles.action} accessibilityLabel={`Editar ${skill.skill_name}`}>
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                    </Pressable>
                    <Pressable onPress={() => onDelete(skill)} hitSlop={8} style={styles.action} accessibilityLabel={`Eliminar ${skill.skill_name}`}>
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    texts: { flex: 1 },
    name: { fontSize: 15, fontWeight: '700', color: colors.text },
    category: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
    actions: { flexDirection: 'row', gap: spacing.xs },
    action: {
        width: 34,
        height: 34,
        borderRadius: radius.sm,
        backgroundColor: colors.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
