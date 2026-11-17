import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextField from '../ui/TextField';
import ChipSelect from '../ui/ChipSelect';
import AppButton from '../ui/AppButton';
import { colors, spacing, typography } from '../../theme';
import { cleanText, isEmail } from '../../utils/validation';

const TAMANOS = ['1-10', '11-50', '51-200', '201-500', '500+'].map((t) => ({ value: t, label: `${t} personas` }));
const CAMPOS = ['business_name', 'tax_identification_number', 'industry', 'company_size', 'description', 'website', 'email', 'phone', 'department', 'city', 'address', 'logo'];

// Formulario para registrar o editar la empresa del reclutador
export default function CompanyForm({ company, onSubmit, onCancel, submitting }) {
    const [form, setForm] = useState(() =>
        Object.fromEntries(CAMPOS.map((c) => [c, company?.[c] ? String(company[c]) : '']))
    );
    const [errores, setErrores] = useState({});
    const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

    const guardar = () => {
        const e = {};
        if (form.business_name.trim().length < 3) e.business_name = 'Escribe la razón social';
        if (!/^\d{6,15}$/.test(form.tax_identification_number.trim())) e.tax_identification_number = 'El NIT debe tener entre 6 y 15 dígitos';
        if (form.email && !isEmail(form.email)) e.email = 'El correo no es válido';
        setErrores(e);
        if (Object.keys(e).length) return;

        const datos = Object.fromEntries(CAMPOS.map((c) => [c, cleanText(form[c])]));
        onSubmit({ ...datos, country: 'Bolivia' });
    };

    return (
        <View>
            <Text style={styles.section}>Datos legales</Text>
            <TextField label="Razón social" required value={form.business_name} onChangeText={set('business_name')} placeholder="Ej. Kantutani Tech SRL" error={errores.business_name} />
            <TextField label="NIT" required keyboardType="number-pad" value={form.tax_identification_number} onChangeText={set('tax_identification_number')} placeholder="1020304050" error={errores.tax_identification_number} />

            <Text style={styles.section}>Sobre la empresa</Text>
            <TextField label="Rubro" value={form.industry} onChangeText={set('industry')} placeholder="Ej. Tecnología" />
            <ChipSelect label="Tamaño" options={TAMANOS} value={form.company_size} onChange={set('company_size')} />
            <TextField label="Descripción" multiline value={form.description} onChangeText={set('description')} placeholder="¿Qué hace tu empresa y por qué trabajar ahí?" />
            <TextField label="URL del logo" value={form.logo} onChangeText={set('logo')} placeholder="https://…" autoCapitalize="none" keyboardType="url" />

            <Text style={styles.section}>Contacto y ubicación</Text>
            <TextField label="Correo de contacto" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errores.email} />
            <TextField label="Teléfono" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
            <TextField label="Sitio web" value={form.website} onChangeText={set('website')} autoCapitalize="none" keyboardType="url" placeholder="https://…" />
            <View style={styles.row}>
                <TextField style={styles.half} label="Departamento" value={form.department} onChangeText={set('department')} />
                <TextField style={styles.half} label="Ciudad" value={form.city} onChangeText={set('city')} />
            </View>
            <TextField label="Dirección" value={form.address} onChangeText={set('address')} />

            <View style={styles.actions}>
                {onCancel && <AppButton title="Cancelar" variant="outline" onPress={onCancel} style={styles.flex} />}
                <AppButton title={company ? 'Guardar cambios' : 'Registrar empresa'} onPress={guardar} loading={submitting} style={styles.flex} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { ...typography.overline, color: colors.primary, marginBottom: spacing.md, marginTop: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.md },
    half: { flex: 1 },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    flex: { flex: 1 }
});
