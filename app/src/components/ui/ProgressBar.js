import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../../theme';

// Barra de progreso de 0 a 100
export default function ProgressBar({ value = 0, color = colors.turquoise, track = colors.surfaceMuted, height = 8, style }) {
    const ancho = Math.max(0, Math.min(100, Number(value) || 0));
    return (
        <View style={[styles.track, { backgroundColor: track, height }, style]}>
            <View style={[styles.fill, { width: `${ancho}%`, backgroundColor: color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    track: { borderRadius: radius.pill, overflow: 'hidden', width: '100%' },
    fill: { height: '100%', borderRadius: radius.pill }
});
