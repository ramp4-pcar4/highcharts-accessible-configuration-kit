<template>
    <div id="highcharts-editor-app" class="highcharts-app-container border border-gray-500">
        <header
            class="editor-header h-[59px] top-0 flex border-b border-black bg-gray-200 py-2 px-2 justify-between z-40"
            :class="{ sticky: !props.plugin }"
        >
            <h1 class="w-mobile-full flex items-center truncate">
                <span class="font-semibold text-lg m-1" v-if="isMobile">
                    {{ $t('HACK.HACK') }}
                </span>
                <span class="font-semibold text-lg m-1" v-else>
                    {{ $t('HACK.highcharts') }}
                </span>
            </h1>

            <button
                @click="changeLang"
                class="bg-white border text-sm md:text-base rounded border-black hover:bg-gray-100 font-bold p-2 ml-auto mr-2"
                v-if="!wetTemplate"
            >
                {{ appLang === 'en' ? $t('HACK.lang.fr') : $t('HACK.lang.en') }}
            </button>

            <button
                @click="emit('cancel')"
                class="bg-white border text-sm md:text-base rounded border-black hover:bg-gray-100 font-bold p-2 ml-auto mr-2"
                v-if="props.plugin"
            >
                {{ $t('HACK.label.cancel') }}
            </button>

            <button
                @click="saveChanges"
                class="bg-black border rounded text-sm md:text-base border-black text-white hover:bg-gray-900 font-bold p-2"
                :class="{ 'disabled hover:bg-gray-400': dataStore.datatableView === false }"
                :disabled="dataStore.datatableView === false"
                v-if="props.plugin"
            >
                {{ $t('HACK.saveChanges') }}
                <span v-if="saving" class="align-middle inline-block px-1">
                    <Spinner size="16px" color="#009cd1" class="ml-1 mb-1"></Spinner>
                </span>
            </button>
        </header>

        <div class="items-stretch flex">
            <SideMenu
                class="flex-shrink-0"
                :lang="appLang"
                :plugin="props.plugin"
                :pluginView="currentView"
                @change-view="changeView"
            ></SideMenu>
            <div class="grid-container z-20 w-full flex-grow min-w-0">
                <router-view :key="$route.path" v-if="!props.plugin"></router-view>
                <div v-else>
                    <component
                        :is="getTemplate()"
                        :lang="props.lang"
                        :plugin="props.plugin"
                        @change-view="changeView"
                    ></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Component, PropType } from 'vue';

import { useChartStore } from './stores/chartStore';
import { useDataStore } from './stores/dataStore';
import { useI18n } from 'vue-i18n';
import { CurrentView, HighchartsConfig } from './definitions';
import type { LangId } from './definitions';
import { buildContextMenuLabels } from './utils/contextMenu';

import SideMenu from './components/side-menu.vue';
import Spinner from './components/helpers/spinner.vue';
import DataSection from '@/components/data-section.vue';
import ChartSelection from '@/components/chart-selection.vue';
import ConfigCustomization from '@/components/config-customization.vue';
const props = defineProps({
    plugin: {
        type: Boolean
    },
    lang: {
        type: String
    },
    config: {
        type: Object as PropType<HighchartsConfig>,
        default: () => ({})
    },
    title: {
        type: String
    }
});

const emit = defineEmits(['cancel', 'saved']);

const wetTemplate = !!document.getElementById('wb-bnr');
const i18n = useI18n();
const { t } = useI18n();
const chartStore = useChartStore();
const dataStore = useDataStore();
const appLang = ref<LangId>('en');
const saving = ref<boolean>(false);
const currentView = ref<CurrentView>(CurrentView.Data);

const resolvedChartConfig = chartStore.resolvedChartConfig;
const activeLang = computed(() => chartStore.activeLang);

const contextMenuLabels = computed(() => buildContextMenuLabels(t, activeLang.value));

const isMobile = ref(false);

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 1024;
};

const getTemplate = (): Component => {
    const pluginComponent: Record<CurrentView | string, Component> = {
        [CurrentView.Data]: DataSection,
        [CurrentView.Template]: ChartSelection,
        [CurrentView.Customization]: ConfigCustomization
    };

    return pluginComponent[currentView.value];
};

if (!props.title) {
    let prevTitle = t('HACK.customization.titles.chartTitle');

    watch(i18n.locale, () => {
        const title = t('HACK.customization.titles.chartTitle');
        if (!chartStore.chartConfig || !chartStore.chartConfig.title) {
            chartStore.chartConfig = chartStore.chartConfig || {};
            chartStore.chartConfig.title = chartStore.chartConfig.title || { text: { en: '', fr: '' } };
        }
        if (
            !chartStore.chartConfig.title.text[appLang.value] ||
            chartStore.chartConfig.title.text[appLang.value] === prevTitle
        ) {
            chartStore.chartConfig.title.text[appLang.value] = title;
        }
        prevTitle = title;
    });
}

watch(activeLang, () => {
    // set context menu labels based on the current language
    chartStore.setMenuOptions(contextMenuLabels.value);
    chartStore.refreshKey += 1;
});

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    appLang.value = i18n.locale.value as LangId;
    // set locale only when standalone usage
    if (!props.plugin) {
        i18n.locale.value = appLang.value;
    }

    // clear store state (required for shared store state for multi-instance charts)
    if (props.plugin) {
        dataStore.resetStore();
        chartStore.resetStore();
        chartStore.setMenuOptions(contextMenuLabels.value);
    }

    chartStore.isBilingual = !props.plugin;

    // if passed an existing highcharts config as prop, load and jump to datatable view
    if (props.config && Object.keys(props.config).length) {
        chartStore.setChartConfig(props.config);
        dataStore.extractGridData(resolvedChartConfig);
        setTimeout(() => {
            dataStore.setDatatableView(true);
        }, 0);
    }

    // if passed title as prop, set it as default chart title
    if (props.title) {
        chartStore.setDefaultTitle(props.title);
    }
});

const changeLang = (): void => {
    appLang.value = appLang.value === 'en' ? 'fr' : 'en';
    i18n.locale.value = appLang.value;

    if (props.plugin && !chartStore.isBilingual) {
        chartStore.activeLang = appLang.value;
    }
};

const changeView = (view: CurrentView): void => {
    currentView.value = view;
    chartStore.setMenuOptions(contextMenuLabels.value);
    chartStore.refreshKey += 1;
};

const saveChanges = (): void => {
    saving.value = true;
    emit('saved', chartStore.chartConfig);
    setTimeout(() => {
        saving.value = false;
    }, 1000);
};

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>

<style lang="scss">
#highcharts-editor-app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(1, calc(100%));
}
</style>
