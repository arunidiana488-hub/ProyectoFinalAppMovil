import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../../theme';

/**
 * Contenedor base de todas las pantallas: respeta la zona segura (notch),
 * permite desplazarse, "jalar para actualizar" y no tapa los campos con el teclado.
 */
export default function Screen({
    children,
    scroll = true,
    refreshing = false,
    onRefresh,
    padded = true,
    header,
    footer,
    edges = ['top'],
    contentStyle,
    style
}) {
    const contenido = scroll ? (
        <ScrollView
            contentContainerStyle={[padded && styles.padded, styles.scrollContent, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
                ) : undefined
            }
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.flex, padded && styles.padded, contentStyle]}>{children}</View>
    );

    return (
        <SafeAreaView edges={edges} style={[styles.safe, style]}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                {header}
                {contenido}
                {footer}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    padded: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
    scrollContent: { paddingBottom: spacing.xxxl * 2 }
});
