import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BottomSheet from '../ui/BottomSheet';
import TextField from '../ui/TextField';
import ChipSelect from '../ui/ChipSelect';
import AppButton from '../ui/AppButton';
import { colors, radius, spacing } from '../../theme';
import { DOCUMENT_TYPES } from '../../constants/options';

// Panel para registrar un título o certificado (queda pendiente de verificación)
export default function DocumentForm({ visible, onClose, onSubmit, submitting }) {
    const [tipo, setTipo] = useState('degree');
    const [nombre, setNombre] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (visible) {
            setTipo('degree');
            setNombre('');
            setInstitucion('');
            setError('');
        }
    }, [visible]);

    const guardar = () => {
        if (nombre.trim().length < 3) {
            setError('Escribe el nombre del título o certificado');
            return;
        }
        const titulo = institucion.trim() ? `${nombre.trim()} · ${institucion.trim()}` : nombre.trim();
        onSubmit({ document_type: tipo, file_name: titulo, mime_type: 'application/pdf' });
    };

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            title="Registrar documento"
            subtitle="Un administrador lo revisará y lo marcará como verificado"
            footer={<AppButton title="Registrar" icon="cloud-upload-outline" onPress={guardar} loading={submitting} full />}
        >
            <ChipSelect label="Tipo de documento" options={DOCUMENT_TYPES} value={tipo} onChange={setTipo} scroll={false} />
            <TextField
                label="Nombre del título o certificado"
                required
                value={nombre}
                onChangeText={(t) => {
                    setNombre(t);
                    setError('');
                }}
                placeholder="Ej. Licenciatura en Ingeniería de Sistemas"
                error={error}
            />
            <TextField label="Institución" value={institucion} onChangeText={setInstitucion} placeholder="Ej. Escuela Militar de Ingeniería" />
            <View style={styles.note}>
                <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
                <Text style={styles.noteText}>
                    En esta versión se registran los datos del documento. La carga del archivo PDF se habilitará con Supabase Storage.
                </Text>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    note: {
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.primarySoft,
        marginBottom: spacing.lg
    },
    noteText: { flex: 1, fontSize: 13, color: colors.primaryDark, lineHeight: 18 }
});
