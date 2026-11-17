// Valores permitidos: deben coincidir con la app móvil (app/src/constants/options.js)
module.exports = {
    ROLES: ['candidate', 'recruiter', 'administrator'],
    ACCOUNT_STATUS: ['active', 'suspended'],
    WORK_MODALITIES: ['remote', 'hybrid', 'onsite'],
    EMPLOYMENT_TYPES: ['full_time', 'part_time', 'internship', 'freelance', 'temporary'],
    PUBLICATION_STATUS: ['draft', 'published', 'closed'],
    APPLICATION_STATUS: ['pending', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected'],
    SKILL_LEVELS: ['basic', 'intermediate', 'advanced'],
    DOCUMENT_TYPES: ['degree', 'technical_title', 'certificate', 'identity', 'other'],
    VERIFICATION_STATUS: ['pending', 'verified', 'rejected']
};
