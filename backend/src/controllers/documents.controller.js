const supabase = require('../config/supabase');
const { check } = require('../utils/db');
const { ok, created } = require('../utils/response');
const { pick, required, assertUuid, oneOf } = require('../utils/validators');
const { badRequest, forbidden, notFound } = require('../utils/ApiError');
const { DOCUMENT_TYPES, VERIFICATION_STATUS } = require('../utils/constants');

const CAMPOS = ['document_type', 'file_name', 'storage_path', 'mime_type', 'file_size'];
const SELECT_DOC = '*, owner:users!documents_user_id_fkey(id, full_name, email)';

const buscarDocumento = async (id) => {
    const { data, error } = await supabase.from('documents').select(SELECT_DOC).eq('id', id).maybeSingle();
    check(error, 'Error al consultar el documento');
    if (!data) throw notFound('Documento no encontrado');
    return data;
};

// GET /api/documents/mine → mis títulos y certificados
const misDocumentos = async (req, res) => {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', req.user.id)
        .order('upload_date', { ascending: false });

    check(error, 'Error al consultar tus documentos');
    ok(res, { total: data.length, documentos: data });
};

// GET /api/documents?status=pending → revisión del administrador
const listarDocumentos = async (req, res) => {
    const { status } = req.query;

    let consulta = supabase.from('documents').select(SELECT_DOC);
    if (status) {
        oneOf(status, VERIFICATION_STATUS, 'status');
        consulta = consulta.eq('verification_status', status);
    }

    const { data, error } = await consulta.order('upload_date', { ascending: false });
    check(error, 'Error al consultar documentos');
    ok(res, { total: data.length, documentos: data });
};

// POST /api/documents → registrar un título o certificado
const registrarDocumento = async (req, res) => {
    const datos = pick(req.body, CAMPOS);
    required(datos, ['document_type', 'file_name']);
    oneOf(datos.document_type, DOCUMENT_TYPES, 'document_type');
    if (datos.file_size !== undefined && (!Number.isInteger(Number(datos.file_size)) || Number(datos.file_size) < 0)) {
        throw badRequest('file_size debe ser un número entero');
    }

    const { data, error } = await supabase
        .from('documents')
        .insert([{ ...datos, user_id: req.user.id, verification_status: 'pending' }])
        .select('*')
        .single();

    check(error, 'Error al registrar el documento');
    created(res, { documento: data }, 'Documento registrado. Queda pendiente de verificación.');
};

// DELETE /api/documents/:id → el dueño (si no está verificado) o el administrador
const eliminarDocumento = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const documento = await buscarDocumento(id);
    const esAdmin = req.user.role === 'administrator';
    if (!esAdmin && documento.user_id !== req.user.id) throw forbidden('Solo puedes eliminar tus documentos');
    if (!esAdmin && documento.verification_status === 'verified') {
        throw badRequest('Un documento verificado no se puede eliminar');
    }

    const { error } = await supabase.from('documents').delete().eq('id', id);
    check(error, 'Error al eliminar el documento');

    ok(res, { documento }, { mensaje: 'Documento eliminado' });
};

// PATCH /api/documents/:id/review  { status: verified|rejected, rejection_reason } (administrador)
const revisarDocumento = async (req, res) => {
    const { id } = req.params;
    assertUuid(id);

    const { status, rejection_reason } = pick(req.body, ['status', 'rejection_reason']);
    required({ status }, ['status']);
    oneOf(status, ['verified', 'rejected'], 'status');
    if (status === 'rejected' && !String(rejection_reason || '').trim()) {
        throw badRequest('Indica el motivo del rechazo');
    }

    await buscarDocumento(id);

    const { error } = await supabase
        .from('documents')
        .update({
            verification_status: status,
            verification_date: new Date().toISOString(),
            verified_by: req.user.id,
            rejection_reason: status === 'rejected' ? rejection_reason : null
        })
        .eq('id', id);
    check(error, 'Error al revisar el documento');

    ok(res, { documento: await buscarDocumento(id) }, {
        mensaje: status === 'verified' ? 'Documento verificado' : 'Documento rechazado'
    });
};

module.exports = { misDocumentos, listarDocumentos, registrarDocumento, eliminarDocumento, revisarDocumento };
