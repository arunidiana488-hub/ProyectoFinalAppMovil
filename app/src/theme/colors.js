// Paleta oficial de TALENTO NOVA
export const colors = {
    midnight: '#101A35',
    midnightSoft: '#1B2A52',
    primary: '#3459F7',
    primaryDark: '#2442C9',
    primarySoft: '#E8EDFF',
    turquoise: '#18C6C0',
    turquoiseSoft: '#E1F7F6',
    violet: '#7755E8',
    violetSoft: '#EFEAFD',

    background: '#FAFBFF',
    surface: '#FFFFFF',
    surfaceMuted: '#F3F5FB',
    border: '#E3E8F2',

    text: '#101A35',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    white: '#FFFFFF',

    success: '#15803D',
    successSoft: '#DCFCE7',
    warning: '#B45309',
    warningSoft: '#FEF3C7',
    danger: '#DC2626',
    dangerSoft: '#FEE2E2'
};

// Combinaciones de color para insignias y tarjetas
export const tones = {
    primary: { bg: colors.primarySoft, fg: colors.primary },
    turquoise: { bg: colors.turquoiseSoft, fg: '#0E8F8A' },
    violet: { bg: colors.violetSoft, fg: colors.violet },
    success: { bg: colors.successSoft, fg: colors.success },
    warning: { bg: colors.warningSoft, fg: colors.warning },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
    neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary }
};
