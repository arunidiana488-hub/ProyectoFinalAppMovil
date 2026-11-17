import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextField from '../ui/TextField';
import ChipSelect from '../ui/ChipSelect';
import AppButton from '../ui/AppButton';
import Card from '../ui/Card';
import { colors, spacing, typography } from '../../theme';
import { CURRENCIES, EMPLOYMENT_TYPES, WORK_MODALITIES } from '../../constants/options';
import { cleanText, isIsoDate, toNumberOrNull } from '../../utils/validation';

const aTexto = (valor) => (valor === null || valor === undefined ? '' : String(valor));

// Convierte una oferta de la API en los valores del formulario
const valoresIniciales = (oferta, empresas) => ({
    company_id: oferta?.company_id || empresas[0]?.id || '',
    job_title: aTexto(oferta?.job_title),
    description: aTexto(oferta?.description),
    requirements: aTexto(oferta?.requirements),
    responsibilities: aTexto(oferta?.responsibilities),
    work_modality: oferta?.work_modality || 'hybrid',
    employment_type: oferta?.employment_type || 'full_time',
    city: aTexto(oferta?.city),
    department: aTexto(oferta?.department),
    salary_min: aTexto(oferta?.salary_min),
    salary_max: aTexto(oferta?.salary_max),
    salary_currency: oferta?.salary_currency || 'BOB',
    experience_required: aTexto(oferta?.experience_required),
    education_required: aTexto(oferta?.education_required),
    vacancies: aTexto(oferta?.vacancies ?? 1),
    expiration_date: oferta?.expiration_date ? oferta.expiration_date.slice(0, 10) : ''
});

/**
 * Formulario para publicar o editar una oferta laboral.
 * onSubmit(datos, estado) → estado: 'draft' | 'published'
 */
export default function JobForm({ job, companies = [], onSubmit, submitting }) {
    const [form, setForm] = useState(() => valoresIniciales(job, companies));
    const [errores, setErrores] = useState({});
    const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

    const validar = () => {
        const e = {};
        if (!form.company_id) e.company_id = 'Primero registra tu empresa';
        if (!form.job_title.trim()) e.job_title = 'El cargo es obligatorio';
        if (form.job_title.trim().length > 0 && form.job_title.trim().length < 4) e.job_title = 'Escribe un cargo más descriptivo';
        if (!form.description.trim()) e.description = 'Describe el puesto para atraer candidatos';

        const min = toNumberOrNull(form.salary_min);
        const max = toNumberOrNull(form.salary_max);
        if (Number.isNaN(min)) e.salary_min = 'Escribe solo números';
        if (Number.isNaN(max)) e.salary_max = 'Escribe solo números';
        if (min !== null && max !== null && !Number.isNaN(min) && !Number.isNaN(max) && min > max) {
            e.salary_max = 'El máximo debe ser mayor que el mínimo';
        }

        const vacantes = Number(form.vacancies);
        if (!Number.isInteger(vacantes) || vacantes < 1) e.vacancies = 'Debe ser un número mayor a 0';

        if (form.expiration_date && !isIsoDate(form.expiration_date)) e.expiration_date = 'Usa el formato AAAA-MM-DD';
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const enviar = (estado) => {
        if (!validar()) return;
        onSubmit(
            {
                company_id: form.company_id,
                job_title: form.job_title.trim(),
                description: cleanText(form.description),
                requirements: cleanText(form.requirements),
                responsibilities: cleanText(form.responsibilities),
                work_modality: form.work_modality,
                employment_type: form.employment_type,
                city: cleanText(form.city),
                department: cleanText(form.department),
                country: 'Bolivia',
                salary_min: toNumberOrNull(form.salary_min),
                salary_max: toNumberOrNull(form.salary_max),
                salary_currency: form.salary_currency,
                experience_required: cleanText(form.experience_required),
                education_required: cleanText(form.education_required),
                vacancies: Number(form.vacancies),
                expiration_date: form.expiration_date ? `${form.expiration_date}T23:59:00` : null,
                publication_status: estado
            },
            estado
        );
    };

    return (
        <View>
            {companies.length > 1 && (
                <ChipSelect
                    label="Empresa"
                    options={companies.map((c) => ({ value: c.id, label: c.business_name }))}
                    value={form.company_id}
                    onChange={set('company_id')}
                />
            )}
            {!!errores.company_id && <Text style={styles.errorGlobal}>{errores.company_id}</Text>}

            <Text style={styles.section}>El puesto</Text>
            <TextField label="Cargo" required value={form.job_title} onChangeText={set('job_title')} placeholder="Ej. Desarrollador Móvil" error={errores.job_title} />
            <TextField label="Descripción" required multiline value={form.description} onChangeText={set('description')} placeholder="Propósito del rol y qué hará la persona" error={errores.description} />
            <TextField label="Requisitos" multiline value={form.requirements} onChangeText={set('requirements')} placeholder="Conocimientos, herramientas y competencias" />
            <TextField label="Responsabilidades" multiline value={form.responsibilities} onChangeText={set('responsibilities')} placeholder="Tareas principales del puesto" />

            <Text style={styles.section}>Condiciones</Text>
            <ChipSelect label="Modalidad" options={WORK_MODALITIES} value={form.work_modality} onChange={set('work_modality')} />
            <ChipSelect label="Tipo de empleo" options={EMPLOYMENT_TYPES} value={form.employment_type} onChange={set('employment_type')} />
            <View style={styles.row}>
                <TextField style={styles.half} label="Ciudad" value={form.city} onChangeText={set('city')} placeholder="La Paz" />
                <TextField style={styles.half} label="Departamento" value={form.department} onChangeText={set('department')} placeholder="La Paz" />
            </View>
            <ChipSelect label="Moneda" options={CURRENCIES} value={form.salary_currency} onChange={set('salary_currency')} />
            <View style={styles.row}>
                <TextField style={styles.half} label="Salario mínimo" keyboardType="numeric" value={form.salary_min} onChangeText={set('salary_min')} placeholder="5000" error={errores.salary_min} />
                <TextField style={styles.half} label="Salario máximo" keyboardType="numeric" value={form.salary_max} onChangeText={set('salary_max')} placeholder="7000" error={errores.salary_max} />
            </View>
            <View style={styles.row}>
                <TextField style={styles.half} label="Vacantes" keyboardType="number-pad" value={form.vacancies} onChangeText={set('vacancies')} error={errores.vacancies} />
                <TextField style={styles.half} label="Fecha límite" value={form.expiration_date} onChangeText={set('expiration_date')} placeholder="2026-12-31" hint="AAAA-MM-DD" error={errores.expiration_date} autoCapitalize="none" />
            </View>

            <Text style={styles.section}>Perfil buscado</Text>
            <TextField label="Experiencia requerida" value={form.experience_required} onChangeText={set('experience_required')} placeholder="Ej. 2 años" />
            <TextField label="Formación requerida" value={form.education_required} onChangeText={set('education_required')} placeholder="Ej. Ingeniería de Sistemas" />

            <Card style={styles.preview}>
                <Text style={styles.previewText}>
                    Al publicar, la oferta aparece de inmediato en el buscador de los candidatos. Como borrador, solo tú la ves.
                </Text>
            </Card>

            <View style={styles.actions}>
                <AppButton title="Guardar borrador" variant="outline" onPress={() => enviar('draft')} disabled={submitting} style={styles.flex} />
                <AppButton title="Publicar" icon="send" onPress={() => enviar('published')} loading={submitting} style={styles.flex} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { ...typography.overline, color: colors.primary, marginBottom: spacing.md, marginTop: spacing.sm },
    row: { flexDirection: 'row', gap: spacing.md },
    half: { flex: 1 },
    errorGlobal: { color: colors.danger, fontSize: 13, marginBottom: spacing.md },
    preview: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
    previewText: { fontSize: 13, color: colors.primaryDark, lineHeight: 19 },
    actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    flex: { flex: 1 }
});
