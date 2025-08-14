declare module '*.md?raw' {
    const src: string;
    export default src;
}

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

declare module '*lang.csv' {
    import { LocaleMessages, VueMessageType } from 'vue-i18n';
    const content: LocaleMessages<VueMessageType>;
    export default content;
}

declare module 'highcharts-vue';
declare module 'file-saver';
declare module 'vue-tippy';
declare module 'vue-accessible-color-picker';
declare module 'vue-papa-parse';
declare module 'vue3-spinners';
