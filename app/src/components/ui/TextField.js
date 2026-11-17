import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../../theme';

// Campo de texto con etiqueta, ayuda, error y opción de mostrar contraseña
export default function TextField({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    hint,
    icon,
    multiline = false,
    secureTextEntry = false,
    keyboardType,
    autoCapitalize = 'sentences',
    editable = true,
    maxLength,
    required = false,
    style,
    ...rest
}) {
    const [focused, setFocused] = useState(false);
    const [oculto, setOculto] = useState(secureTextEntry);

    return (
        <View style={[styles.wrapper, style]}>
            {!!label && (
                <Text style={styles.label}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}
            <View
                style={[
                    styles.box,
                    multiline && styles.boxMultiline,
                    focused && styles.boxFocused,
                    !!error && styles.boxError,
                    !editable && styles.boxDisabled
                ]}
            >
                {icon && <Ionicons name={icon} size={18} color={focused ? colors.primary : colors.textMuted} />}
                <TextInput
                    value={value === null || value === undefined ? '' : String(value)}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    style={[styles.input, multiline && styles.inputMultiline]}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    secureTextEntry={oculto}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={!secureTextEntry && autoCapitalize !== 'none'}
                    editable={editable}
                    maxLength={maxLength}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...rest}
                />
                {secureTextEntry && (
                    <Pressable
                        onPress={() => setOculto(!oculto)}
                        hitSlop={10}
                        accessibilityLabel={oculto ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                    >
                        <Ionicons name={oculto ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
                    </Pressable>
                )}
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            {!error && !!hint && <Text style={styles.hint}>{hint}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: spacing.lg },
    label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
    required: { color: colors.danger },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        minHeight: 50,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.md
    },
    boxMultiline: { alignItems: 'flex-start', paddingVertical: spacing.md, minHeight: 110 },
    boxFocused: { borderColor: colors.primary },
    boxError: { borderColor: colors.danger },
    boxDisabled: { backgroundColor: colors.surfaceMuted },
    input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: spacing.sm },
    inputMultiline: { minHeight: 84, paddingVertical: 0 },
    error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
    hint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs }
});
