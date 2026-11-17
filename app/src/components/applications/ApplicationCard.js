import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { colors, spacing, typography } from '../../theme';
import { formatDate } from '../../utils/format';

/**
 * Tarjeta de postulación.
 *  perspective="candidate": muestra la oferta y la empresa
 *  perspective="recruiter": muestra al candidato y la oferta a la que postuló
 */
export default function ApplicationCard({ application, perspective = 'candidate', onPress }) {
    const esCandidato = perspective === 'candidate';
    const oferta = application.job;
    const nombre = esCandidato ? oferta?.company?.business_name : application.candidate?.full_name;
    const titulo = esCandidato ? oferta?.job_title : application.candidate?.full_name;
    const subtitulo = esCandidato ? oferta?.company?.business_name : oferta?.job_title;

    return (
        <Card onPress={onPress}>
            <View style={styles.row}>
                <Avatar
                    name={nombre || '?'}
                    uri={esCandidato ? oferta?.company?.logo : application.candidate?.profile_photo}
                    size={46}
                    square={esCandidato}
                />
                <View style={styles.texts}>
                    <Text style={styles.title} numberOfLines={1}>{titulo || 'Oferta eliminada'}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>{subtitulo || '—'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
            <View style={styles.footer}>
                <ApplicationStatusBadge status={application.application_status} />
                <Text style={styles.date}>Postuló el {formatDate(application.application_date)}</Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    texts: { flex: 1 },
    title: { ...typography.h3, color: colors.text },
    subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.md
    },
    date: { fontSize: 12, color: colors.textSecondary }
});
