import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../theme';

// Barra de pestañas inferior. Ícono relleno en la pestaña activa, contorno en las demás.
export default function BottomTabs({ tabs, active, onChange }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
            {tabs.map((tab, index) => {
                const activo = index === active;
                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onChange(index)}
                        style={styles.tab}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: activo }}
                        accessibilityLabel={tab.label}
                    >
                        <View style={[styles.pill, activo && styles.pillActive]}>
                            <Ionicons
                                name={activo ? tab.icon : `${tab.icon}-outline`}
                                size={22}
                                color={activo ? colors.primary : colors.textMuted}
                            />
                        </View>
                        <Text style={[styles.label, activo && styles.labelActive]} numberOfLines={1}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.sm,
        paddingHorizontal: spacing.xs
    },
    tab: { flex: 1, alignItems: 'center', gap: 2 },
    pill: {
        width: 52,
        height: 30,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pillActive: { backgroundColor: colors.primarySoft },
    label: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
    labelActive: { color: colors.primary, fontWeight: '800' }
});
