import { StyleSheet, Text, View } from 'react-native';

import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { colors, spacing, typography } from '../../theme';
import { VERIFICATION_STATUS, optionOf } from '../../constants/options';

// Tarjeta de empresa con su estado de verificación
export default function CompanyCard({ company, onPress, children }) {
    const estado = optionOf(VERIFICATION_STATUS, company.verification_status) || VERIFICATION_STATUS[0];
    const ubicacion = [company.city, company.country].filter(Boolean).join(', ');

    return (
        <Card onPress={onPress}>
            <View style={styles.row}>
                <Avatar name={company.business_name} uri={company.logo} size={50} square />
                <View style={styles.texts}>
                    <Text style={styles.name} numberOfLines={2}>{company.business_name}</Text>
                    <Text style={styles.meta} numberOfLines={1}>
                        NIT {company.tax_identification_number}
                        {ubicacion ? ` · ${ubicacion}` : ''}
                    </Text>
                </View>
            </View>
            <View style={styles.badges}>
                <Badge label={estado.label} tone={estado.tone} icon={company.verification_status === 'verified' ? 'shield-checkmark' : undefined} />
                {!!company.industry && <Badge label={company.industry} />}
                {!!company.company_size && <Badge label={`${company.company_size} personas`} />}
            </View>
            {children}
        </Card>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    texts: { flex: 1 },
    name: { ...typography.h3, color: colors.text },
    meta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }
});
