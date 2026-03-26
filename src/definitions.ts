export interface HighchartsConfig {
    chart?: {
        type: string;
    };
    lang?: ExportMenuOptions;
    title: {
        text: LocalizedString;
    };
    credits?: {
        enabled: boolean;
    };
    subtitle: {
        text: LocalizedString;
    };
    yAxis: {
        title: {
            text: LocalizedString;
        };
    };
    xAxis: {
        title: {
            text: LocalizedString;
        };
        categories: (number | LocalizedString)[];
    };
    data?: {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
    };
    colors?: string[];
    plotOptions?: any;
    exporting?: {
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
        enabled?: boolean;
    };
    legend?: {
        enabled?: boolean;
    };
    tooltip?: {
        footerFormat?: string;
        format?: string;
        headerFormat?: string;
        pointFormat?: string;
        useHTML?: boolean;
    };
    series: SeriesData[] | { data: SeriesData[] };
}

export interface ExportMenuOptions {
    viewFullscreen: string;
    printChart: string;
    downloadPNG: string;
    downloadJPEG: string;
    downloadPDF: string;
    downloadSVG: string;
    downloadCSV: string;
    downloadXLS: string;
    viewData: string;
}

export interface SeriesData {
    name: LocalizedString;
    type: string;
    color?: string;
    colors?: string[];
    y?: number;
    marker?: {
        symbol: string;
    };
    dashStyle?: string;
    data?: number[];
    visible?: boolean;
}

export enum CurrentView {
    Data = 'data',
    Template = 'template',
    Customization = 'customization'
}

export type LangId = 'en' | 'fr';

export type LocalizedString = {
    en: string;
    fr: string;
};
