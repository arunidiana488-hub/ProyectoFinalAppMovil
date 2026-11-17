import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, shadow, spacing } from '../../theme';

// Barra de búsqueda con botón para borrar
export default function SearchBar({ value, onChangeText, placeholder = 'Buscar…', onSubmit, style }) {
    return (
        <View style={[styles.box, style]}>
            <Ionicons name="search" size={19} color={colors.textMuted} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                returnKeyType="search"
                onSubmitEditing={onSubmit}
                autoCorrect={false}
            />
            {!!value && (
                <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Borrar búsqueda">
                    <Ionicons name="close-circle" size={19} color={colors.textMuted} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        height: 50,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        ...shadow.card
    },
    input: { flex: 1, fontSize: 15, color: colors.text }
});
