import type { LangId } from '@/definitions';

// keys for the Highcharts context menu that need localization
export const CONTEXT_MENU_KEYS = [
    'viewFullscreen',
    'printChart',
    'downloadPNG',
    'downloadJPEG',
    'downloadPDF',
    'downloadSVG',
    'downloadCSV',
    'downloadXLS',
    'viewData'
] as const;

export type ContextMenuKey = (typeof CONTEXT_MENU_KEYS)[number];

// Build a localized object of context menu labels for a given lanugage.
export function buildContextMenuLabels(
    t: (key: string, args?: any, options?: { locale?: LangId }) => string,
    locale: LangId
): Record<ContextMenuKey, string> {
    return Object.fromEntries(CONTEXT_MENU_KEYS.map((key) => [key, t(`HACK.export.${key}`, {}, { locale })])) as Record<
        ContextMenuKey,
        string
    >;
}
