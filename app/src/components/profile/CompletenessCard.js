import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import AppButton from '../ui/AppButton';
import { colors, spacing } from '../../theme';

// Calcula qué tan completo está el perfil del candidato y qué le falta
export const computeCompleteness = ({ user, curriculum, skills = [], documents = [] }) => {
    const pasos = [
        { ok: !!user?.phone, label: 'Agrega un teléfono de contacto' },
        { ok: !!curriculum?.title, label: 'Escribe tu título profesional' },
        { ok: !!curriculum?.description, label: 'Escribe un resumen profesional' },
        { ok: !!curriculum?.experience, label: 'Cuenta tu experiencia laboral' },
        { ok: !!curriculum?.education, label: 'Agrega tus estudios' },
        { ok: !!curriculum?.languages, label: 'Indica los idiomas que hablas' },
        { ok: skills.length >= 3, label: 'Registra al menos 3 habilidades' },
        { ok: documents.length >= 1, label: 'Sube un título o certificado' }
    ];
    const hechos = pasos.filter((p) => p.ok).length;
    return {
        percent: Math.round((hechos / pasos.length) * 100),
        missing: pasos.filter((p) => !p.ok).map((p) => p.label)
    };
};

// Tarjeta "Tu perfil está al 75%" con la siguiente acción sugerida
export default function CompletenessCard({ percent, missing = [], onPress }) {
    const completo = percent >= 100;
    return (
        <Card>
            <View style={styles.row}>
                <View style={styles.icon}>
                    <Ionicons name={completo ? 'trophy-outline' : 'sparkles-outline'} size={20} color={colors.violet} />
                </View>
                <View style={styles.texts}>
                    <Text style={styles.title}>{completo ? 'Tu perfil está completo' : `Tu perfil está al ${percent}%`}</Text>
                    <Text style={styles.subtitle}>
                        {completo ? 'Las empresas pueden ver toda tu información.' : missing[0]}
                    </Text>
                </View>
                <Text style={styles.percent}>{percent}%</Text>
            </View>
            <ProgressBar value={percent} style={styles.bar} />
            {!completo && onPress && (
                <AppButton title="Completar mi perfil" variant="secondary" size="sm" iconRight="arrow-forward" onPress={onPress} style={styles.button} />
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.violetSoft,
        alignItems: 'center',
        justifyContent: 'center'
    },
    texts: { flex: 1 },
    title: { fontSize: 15, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    percent: { fontSize: 18, fontWeight: '800', color: colors.turquoise },
    bar: { marginTop: spacing.md },
    button: { marginTop: spacing.md, alignSelf: 'flex-start' }
});
