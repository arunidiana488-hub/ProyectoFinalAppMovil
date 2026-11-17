import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme';

/**
 * Logotipo de TALENTO NOVA: una "N" formada por trazos que unen nodos
 * (talento, conexión y crecimiento) sobre un cuadro azul eléctrico.
 */
export default function Logo({ size = 40, light = false, showText = true }) {
    const ancho = size * 0.5;
    const alto = size * 0.5;
    const trazo = Math.max(2, size * 0.085);
    const nodo = size * 0.17;

    // Diagonal de la N: de la esquina superior izquierda a la inferior derecha
    const dx = ancho - trazo;
    const largo = Math.sqrt(dx * dx + alto * alto);
    const angulo = (Math.atan(dx / alto) * 180) / Math.PI;

    const punto = (pos, acento = false) => (
        <View
            style={[
                styles.node,
                acento && styles.nodeAccent,
                { width: nodo, height: nodo, borderRadius: nodo / 2, ...pos }
            ]}
        />
    );

    return (
        <View style={styles.row}>
            <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.3 }]}>
                <View style={{ width: ancho, height: alto }}>
                    <View style={[styles.bar, { left: 0, top: 0, height: alto, width: trazo }]} />
                    <View style={[styles.bar, { right: 0, top: 0, height: alto, width: trazo }]} />
                    <View
                        style={[
                            styles.bar,
                            {
                                left: ancho / 2 - trazo / 2,
                                top: alto / 2 - largo / 2,
                                height: largo,
                                width: trazo,
                                transform: [{ rotate: `-${angulo}deg` }]
                            }
                        ]}
                    />
                    {punto({ left: trazo / 2 - nodo / 2, top: -nodo / 2 })}
                    {punto({ right: trazo / 2 - nodo / 2, top: -nodo / 2 })}
                    {punto({ right: trazo / 2 - nodo / 2, bottom: -nodo / 2 }, true)}
                </View>
            </View>
            {showText && (
                <Text style={[styles.brand, { fontSize: size * 0.4, color: light ? colors.white : colors.midnight }]}>
                    TALENTO <Text style={styles.accent}>NOVA</Text>
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    mark: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    bar: { position: 'absolute', backgroundColor: colors.white, borderRadius: 4 },
    node: { position: 'absolute', backgroundColor: colors.white },
    nodeAccent: { backgroundColor: colors.turquoise },
    brand: { fontWeight: '800', letterSpacing: 0.5 },
    accent: { color: colors.turquoise }
});
