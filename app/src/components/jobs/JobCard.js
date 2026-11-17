import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import JobStatusBadge from './JobStatusBadge';
import { colors, spacing, typography } from '../../theme';
import { EMPLOYMENT_TYPES, WORK_MODALITIES, labelOf } from '../../constants/options';
import { daysUntil, formatSalary, timeAgo } from '../../utils/format';

// Tarjeta de oferta laboral para listas (buscador, mis vacantes, inicio)
export default function JobCard({ job, onPress, showStatus = false, compact = false }) {
    const empresa = job.company?.business_name || 'Empresa';
    const dias = daysUntil(job.expiration_date);

    return (
        <Card onPress={onPress}>
            <View style={styles.top}>
                <Avatar name={empresa} uri={job.company?.logo} size={46} square />
                <View style={styles.titles}>
                    <Text style={styles.title} numberOfLines={2}>{job.job_title}</Text>
                    <Text style={styles.company} numberOfLines={1}>
                        {empresa}
                        {job.company?.verification_status === 'verified' && ' '}
                        {job.company?.verification_status === 'verified' && (
                            <Ionicons name="checkmark-circle" size={13} color={colors.turquoise} />
                        )}
                    </Text>
                </View>
                {showStatus && <JobStatusBadge status={job.publication_status} />}
            </View>

            <View style={styles.badges}>
                {!!job.work_modality && <Badge label={labelOf(WORK_MODALITIES, job.work_modality)} tone="primary" icon="laptop-outline" />}
                {!!job.employment_type && <Badge label={labelOf(EMPLOYMENT_TYPES, job.employment_type)} tone="violet" />}
                {!!job.city && <Badge label={job.city} icon="location-outline" />}
            </View>

            {!compact && (
                <View style={styles.footer}>
                    <Text style={styles.salary}>{formatSalary(job.salary_min, job.salary_max, job.salary_currency)}</Text>
                    {job.total_postulaciones !== undefined ? (
                        <Text style={styles.meta}>
                            <Ionicons name="people-outline" size={13} color={colors.textSecondary} /> {job.total_postulaciones} postulaciones
                        </Text>
                    ) : (
                        <Text style={[styles.meta, dias !== null && dias <= 5 && styles.urgent]}>
                            {dias === null ? timeAgo(job.publication_date || job.created_at) : dias < 0 ? 'Cerrada' : `Cierra en ${dias} días`}
                        </Text>
                    )}
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
    titles: { flex: 1 },
    title: { ...typography.h3, color: colors.text },
    company: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border
    },
    salary: { fontSize: 15, fontWeight: '800', color: colors.text },
    meta: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
    urgent: { color: colors.warning }
});
