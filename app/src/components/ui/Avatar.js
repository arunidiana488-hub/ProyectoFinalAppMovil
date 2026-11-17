import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme';
import { initials } from '../../utils/format';

const FONDOS = [colors.primary, colors.violet, '#0E9F9A', colors.midnightSoft];

// Foto de perfil; si no hay foto (o falla), muestra las iniciales
export default function Avatar({ name = '', uri, size = 48, square = false, style }) {
    const [fallo, setFallo] = useState(false);
    const forma = { width: size, height: size, borderRadius: square ? size * 0.28 : size / 2 };
    const fondo = FONDOS[(name.length || 0) % FONDOS.length];

    if (uri && !fallo) {
        return <Image source={{ uri }} style={[forma, styles.image, style]} onError={() => setFallo(true)} />;
    }

    return (
        <View style={[forma, styles.fallback, { backgroundColor: fondo }, style]}>
            <Text style={[styles.text, { fontSize: size * 0.36 }]}>{initials(name)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: { backgroundColor: colors.surfaceMuted },
    fallback: { alignItems: 'center', justifyContent: 'center' },
    text: { color: colors.white, fontWeight: '800' }
});
