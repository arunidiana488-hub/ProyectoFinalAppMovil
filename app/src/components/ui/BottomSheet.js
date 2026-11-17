import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../../theme';

// Panel que sube desde abajo para formularios cortos (agregar habilidad, cambiar estado…)
export default function BottomSheet({ visible, onClose, title, subtitle, children, footer }) {
    const insets = useSafeAreaInsets();

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
                <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <View style={styles.texts}>
                            <Text style={styles.title}>{title}</Text>
                            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                        </View>
                        <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityLabel="Cerrar">
                            <Ionicons name="close" size={20} color={colors.text} />
                        </Pressable>
                    </View>
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} style={styles.body}>
                        {children}
                    </ScrollView>
                    {footer}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(16, 26, 53, 0.45)' },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.sm,
        maxHeight: '88%'
    },
    handle: {
        alignSelf: 'center',
        width: 42,
        height: 5,
        borderRadius: radius.pill,
        backgroundColor: colors.border,
        marginBottom: spacing.md
    },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.lg },
    texts: { flex: 1 },
    title: { ...typography.h2, color: colors.text },
    subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
    close: {
        width: 36,
        height: 36,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceMuted,
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: { flexGrow: 0 }
});
