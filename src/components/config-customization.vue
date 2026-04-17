<template>
    <div :class="[{ hidden: hidePage }, 'chart-customization', 'md:m-6', 'm-2']" v-if="Object.keys(chartConfig).length">
        <div class="text-xl md:text-2xl font-bold">{{ $t('HACK.customization.title') }}</div>
        <!-- header nav section for customization options -->
        <div class="mt-8 w-full">
            <div class="tab-container grid grid-cols-4">
                <div
                    v-for="(section, idx) in sections"
                    :key="idx"
                    class="tab-label cursor-pointer py-2 px-2 flex-1 text-center"
                    tabindex="0"
                    :class="{ 'font-semibold': activeSection === section }"
                    @click="
                        () => {
                            activeSection = section;
                            if (section === 'advanced') {
                                addAriaLabel();
                                updateEditorFromConfig();
                            }
                        }
                    "
                    @keydown.enter="
                        () => {
                            activeSection = section;
                            updateEditorFromConfig();
                        }
                    "
                >
                    {{ $t(`HACK.customization.${section}`) }}
                    <!-- small screen nav bar -->
                    <div
                        class="nav-underline h-1 flex-1 transition-all"
                        :class="activeSection === section ? 'bg-black' : 'bg-gray-300'"
                    ></div>
                </div>
            </div>
            <!-- big screen nav bar -->
            <div class="nav-tab flex">
                <div
                    v-for="section in sections"
                    :key="section"
                    class="h-1 flex-1 transition-all"
                    :class="activeSection === section ? 'bg-black' : 'bg-gray-300'"
                ></div>
            </div>
        </div>

        <div v-if="activeSection === 'chartTitles' || activeSection === 'axes'">
            <LanguageTabs v-model:activeLang="chartStore.activeLang" />
        </div>

        <!-- Configure chart titles -->
        <template v-if="activeSection === 'chartTitles'">
            <titles-customization />
        </template>

        <!-- Customize chart data options -->
        <template v-else-if="activeSection === 'dataSeries'">
            <div
                class="flex mt-4 overflow-x-auto"
                v-if="
                    chartStore.hybridChartType &&
                    chartStore.hybridChartType !== chartStore.chartType &&
                    hybridDataSeries.length > 0
                "
            >
                <data-customization
                    :dataSeries="mainDataSeries"
                    :hybrid="true"
                    :chartType="chartStore.chartType"
                    class="bg-gray-200 rounded p-4 pb-8 mr-16 flex-1"
                >
                    <h2 class="font-bold mb-4">{{ $t('HACK.graph', { num: 1 }) }}</h2>
                </data-customization>
                <span class="inline-block w-[64px]"></span>
                <data-customization
                    :dataSeries="hybridDataSeries"
                    :hybrid="true"
                    :chartType="chartStore.hybridChartType"
                    class="bg-gray-200 rounded p-4 pb-8 mr-16 flex-1"
                >
                    <h2 class="font-bold mb-4">{{ $t('HACK.graph', { num: 2 }) }}</h2>
                </data-customization>
            </div>

            <data-customization
                :dataSeries="mainDataSeries"
                :chartType="chartStore.chartType"
                @loading="(val) => (loading = val)"
                v-else
            />
        </template>

        <!-- Configure chart axes -->
        <template v-else-if="activeSection === 'axes'">
            <axes-customization />
        </template>
        <!-- RAMP JSON editor -->
        <template v-else>
            <JsonEditor
                class="mt-4"
                :key="locale"
                :modelValue="configJson"
                :lang="locale"
                :validator="validate"
                @update:modelValue="onJsonChange"
                height="60vh"
            />
            <div v-if="validatorErrors.length">
                <ul class="list-disc ml-8">
                    <li v-for="(error, idx) in validatorErrors" :key="idx">{{ error }}</li>
                </ul>
            </div>
        </template>

        <div v-if="!loading">
            <!-- Highcharts preview -->
            <div class="font-bold mt-6">{{ $t('HACK.preview') }}</div>
            <!-- Preview of chart -->
            <div class="dv-chart-container items-stretch h-full w-full mt-2">
                <highchart :key="chartStore.refreshKey" :options="chartStore.resolvedChartConfig"></highchart>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChartStore } from '../stores/chartStore';
import { useSidemenuStore } from '../stores/sidemenuStore';
import { SeriesData } from '../definitions';
import { useI18n } from 'vue-i18n';
import schema from '../../HighchartsSchema.json';

import LanguageTabs from './helpers/language-tabs.vue';
import TitlesCustomization from './helpers/titles-customization.vue';
import DataCustomization from './helpers/data-customization.vue';
import AxesCustomization from './helpers/axes-customization.vue';

import Ajv from 'ajv';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';

exporting(Highcharts);
exportData(Highcharts);
dataModule(Highcharts);

const chartStore = useChartStore();
const sidemenuStore = useSidemenuStore();
const chartConfig = computed(() => chartStore.chartConfig);
let updatedConfig = ref<any>({});
const configJson = ref('');

const { t, locale } = useI18n();
const router = useRouter();

// add back 'advanced' after json editor implemented
const sections = ['chartTitles', 'dataSeries', 'axes', 'advanced'];
// default to chart titles
const activeSection = ref<string>('chartTitles');
const loading = ref<boolean>(false);

let highchartsSchema = ref<any>(null);
const validatorErrors = ref<any>([]);
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const isSmallScreen = ref(false);
const hidePage = computed(() => {
    return sidemenuStore.expanded && isSmallScreen.value;
});

const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 500;
};

onBeforeMount(() => {
    // case of directly accessing page with no data
    if (Object.keys(chartConfig.value).length === 0) {
        router.push({ name: 'Data' });
    }
});

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    // import highcharts schema for validation
    highchartsSchema.value = schema as any;
    updatedConfig.value = chartConfig.value;
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});

const mainDataSeries = computed(() => {
    if (Array.isArray(chartConfig.value.series)) {
        return (chartConfig.value.series as SeriesData[])
            .filter((s) => s.type === chartStore.chartType)
            .map((s) => s.name);
    } else {
        return [chartConfig.value.series.data[0].name];
    }
});

const hybridDataSeries = computed(() => {
    if (chartStore.hybridChartType && chartStore.hybridChartType !== chartStore.chartType) {
        return (chartConfig.value.series as SeriesData[])
            .filter((s) => s.type === chartStore.hybridChartType)
            .map((s) => s.name);
    } else {
        return [];
    }
});

// validate updated highcharts config edited in JSON editor
const onJsonChange = (newJson: string) => {
    let parsed: any;

    try {
        parsed = JSON.parse(newJson);
    } catch (error: any) {
        validatorErrors.value = [error.message];
        return;
    }

    // schema validation
    if (!validate(parsed)) {
        validatorErrors.value = validate.errors?.map((err) => `${err.dataPath}: ${err.message}`) ?? [];
        return;
    }

    validatorErrors.value = [];

    if (JSON.stringify(parsed) === JSON.stringify(updatedConfig.value)) {
        return;
    }

    // valid JSOn to update chart config
    updatedConfig.value = parsed;
    chartStore.setChartConfig(parsed);
};

const addAriaLabel = () => {
    setTimeout(() => {
        const textarea = document.querySelector('.ace_text-input');
        if (textarea) {
            textarea.setAttribute('aria-label', t('HACK.customization.advanced'));
        }
    }, 0);
};

const updateEditorFromConfig = () => {
    updatedConfig.value = chartConfig.value;
    configJson.value = JSON.stringify(updatedConfig.value, null, 2);
};
</script>

<style lang="scss" scoped>
.dv-chart-container {
    width: 98%;
}

:deep(.json-editor) {
    resize: vertical;
    overflow: auto;
    min-height: 20vh;
    max-height: 80vh;
}

:deep(.jsoneditor-modes) {
    display: none;
}

:deep(.jsoneditor-poweredBy),
.nav-underline {
    display: none;
}

@media (max-width: 700px) {
    .tab-container {
        grid-template-columns: repeat(2, 1fr);
    }

    .nav-tab {
        display: none;
    }

    .tab-label {
        align-self: flex-end;
    }

    .nav-underline {
        display: flex;
        align-items: stretch;
    }
}

@media (max-width: 280px) {
    .tab-container {
        display: flex;
        overflow-x: auto;
    }

    .nav-underline {
        display: none;
    }

    .tab-label {
        padding-left: 1rem;
        padding-right: 1rem;
        align-self: center;
    }
}
</style>
