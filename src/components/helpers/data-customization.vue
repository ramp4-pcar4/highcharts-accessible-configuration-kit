<template>
    <div class="graph-customization" v-if="activeSeries">
        <slot></slot>
        <div class="font-bold mt-6">{{ $t('HACK.customization.dataSeries') }}</div>
        <div class="relative mt-2 selector">
            <select
                class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                v-model="activeDataSeries"
                :aria-label="$t('HACK.customization.dataSeries')"
                @change="changeChartType(false)"
            >
                <!-- Enable insert when exactly one row is selected, enable delete when any number of rows are selected -->
                <template v-if="chartType === 'pie'">
                    <option v-for="series in allSeriesNames" :key="series" :value="series">
                        {{ series }}
                    </option>
                </template>
                <template v-else>
                    <option v-for="series in dataSeries" :value="series">
                        {{ series }}
                    </option>
                </template>
            </select>
            <div class="select-arrow absolute right-2 top-1/2"></div>
        </div>

        <h2 class="font-bold mt-6">{{ $t('HACK.customization.data.format') }}</h2>
        <div class="font-bold mt-4">{{ $t('HACK.customization.data.seriesType') }}</div>
        <div class="relative mt-2 selector">
            <input
                disabled
                type="text"
                class="border border-black w-full p-2 rounded bg-white"
                :value="chartType"
                :aria-label="$t('HACK.customization.data.seriesType')"
                v-if="hybrid"
            />
            <!-- TODO: decide if should allow changing series type in hybrid customization - may lead to complications -->
            <div v-else>
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="chartType"
                    :aria-label="$t('HACK.customization.data.seriesType')"
                    @change="changeChartType()"
                >
                    <option v-for="series in Object.keys(seriesOptions)" :key="series" :value="series">
                        {{ $t(`HACK.customization.data.series.${series}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>
        </div>

        <div v-if="chartType !== 'pie'">
            <div class="font-bold mt-4">{{ $t('HACK.customization.data.colour') }}</div>
            <div class="flex flex-col mt-2 selector">
                <div
                    class="colour-dropdown w-full rounded border border-gray-500 flex items-center justify-between cursor-pointer"
                    @click="() => (showColourPicker = !showColourPicker)"
                    @keypress.enter="() => (showColourPicker = !showColourPicker)"
                    tabindex="0"
                >
                    <div class="flex w-full h-full bg-white rounded">
                        <div
                            class="rounded border-r border-gray-400 w-10"
                            tabindex="0"
                            :style="{ 'background-color': activeSeries?.color ?? '#000000' }"
                        ></div>
                        <div class="flex items-center px-3">{{ activeSeries?.color ?? '' }}</div>
                        <div class="flex items-center justify-center pr-2 ml-auto">
                            <span class="select-arrow"></span>
                        </div>
                    </div>
                </div>
                <div
                    v-if="showColourPicker"
                    class="w-full items-center justify-center border border-gray-300 rounded-md p-2 shadow-sm"
                >
                    <ColorPicker
                        :color="activeSeries?.color ?? '#000000'"
                        alpha-channel="hide"
                        :visible-formats="['hex']"
                        default-format="hex"
                        @color-change="updateColour"
                    >
                        <template #copy-button></template>
                    </ColorPicker>
                </div>
            </div>

            <div class="font-bold mt-4">{{ $t('HACK.customization.data.dashStyle') }}</div>
            <div class="relative mt-2 selector">
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="activeSeries!.dashStyle"
                    :aria-label="$t('HACK.customization.data.dashStyle')"
                >
                    <option v-for="dashStyle in Object.keys(dashOptions)" :key="dashStyle" :value="dashStyle">
                        {{ $t(`HACK.customization.data.${dashStyle}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>

            <div class="font-bold mt-4">{{ $t('HACK.customization.data.pointMarker') }}</div>
            <div class="relative mt-2 selector">
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="activeSeries!.marker!.symbol"
                    :aria-label="$t('HACK.customization.data.pointMarker')"
                >
                    <option v-for="pointMarker in Object.keys(markerOptions)" :key="pointMarker" :value="pointMarker">
                        {{ $t(`HACK.customization.data.${pointMarker}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>
        </div>

        <div v-else>
            <div class="font-bold mt-4">{{ $t('HACK.customization.data.colours') }}</div>
            <div class="flex flex-col mt-2 w-1/6">
                <div class="flex flex-col" v-for="(color, index) in activeSeries?.colors ?? []" :key="index">
                    <div
                        class="colour-dropdown w-full rounded border border-gray-500 flex items-center justify-between cursor-pointer mb-2"
                        @click="() => (showPieColourPicker[index] = !showPieColourPicker[index])"
                        @keypress.enter="() => (showPieColourPicker[index] = !showPieColourPicker[index])"
                        tabindex="0"
                    >
                        <div class="flex w-full h-full bg-white rounded">
                            <div
                                class="rounded border-r border-gray-400 w-10"
                                tabindex="0"
                                :style="{ 'background-color': color }"
                            ></div>
                            <div class="flex items-center px-3">{{ color }}</div>
                            <div class="flex items-center justify-center pr-2 ml-auto">
                                <span class="select-arrow"></span>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="showPieColourPicker[index]"
                        class="w-full items-center justify-center border border-gray-300 rounded-md p-2 shadow-sm"
                    >
                        <ColorPicker
                            :color="color"
                            alpha-channel="hide"
                            :visible-formats="['hex']"
                            default-format="hex"
                            @color-change="(eventData) => updatePieColour(index, eventData.cssColor)"
                        >
                            <template #copy-button></template>
                        </ColorPicker>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useDataStore } from '../../stores/dataStore';
import { useChartStore } from '../../stores/chartStore';

const props = defineProps({
    dataSeries: {
        type: Array<string>,
        required: true
    },
    chartType: {
        type: String,
        required: true
    },
    hybrid: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['loading']);

const dataStore = useDataStore();
const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);

const activeDataSeries = ref<string>('');
const activeSeries = computed(() => {
    if (Array.isArray(chartConfig.value.series)) {
        return chartConfig.value.series.find((s) => s.name === activeDataSeries.value);
    } else {
        return chartConfig.value.series;
    }
});

const allSeriesNames = computed(() => {
    if (Array.isArray(chartConfig.value.series)) {
        return chartConfig.value.series.map((s) => s.name);
    }
    return [];
});

const showColourPicker = ref<boolean>(false);
const showPieColourPicker = ref<boolean[]>([]);

const chartType = ref<string>('');

const seriesOptions: Record<string, string> = {
    area: 'area',
    bar: 'bar',
    column: 'column',
    line: 'line',
    pie: 'pie',
    scatter: 'scatter',
    spline: 'spline'
};

const dashOptions: Record<string, string> = {
    dot: 'dot',
    dash: 'dash',
    solid: 'solid'
};

const markerOptions: Record<string, string> = {
    square: 'square',
    circle: 'circle',
    triangle: 'triangle'
};

onBeforeMount(() => {
    const series = chartConfig.value.series;
    activeDataSeries.value = props.dataSeries[0] ?? '';
    chartType.value = activeSeries.value?.type ?? '';
    if (chartType.value === 'pie') {
        // To ensure that dropdown and colours reflect the graph being displayed when switching back to the data series tab
        if (Array.isArray(series)) {
            const visiblePie = series.find((s) => s.type === 'pie' && s.visible !== false);
            activeDataSeries.value = visiblePie?.name || series[0]?.name || '';
        }
        const activeSeriesColors = (activeSeries.value as SeriesData)?.colors;
        if (activeSeriesColors) {
            activeSeriesColors.forEach((_, i) => {
                showPieColourPicker[i] = false;
            });
        }
    }
});

const updateColour = (eventData: any) => {
    if (activeSeries.value) {
        activeSeries.value.color = eventData.cssColor;
    }
};

const updatePieColour = (index: number, color: string) => {
    if (activeSeries.value?.colors) {
        activeSeries.value.colors[index] = color;
    }
};

const changeChartType = (updateChart = true) => {
    if (updateChart || chartType.value === 'pie') {
        emit('loading', true);
        const selectedSeries = activeDataSeries.value;
        const seriesNames = Object.values(dataStore.headers).slice(1);

        let currentColours: string[] = [];
        if (activeSeries.value && 'name' in activeSeries.value && Array.isArray(activeSeries.value.colors)) {
            currentColours = [...activeSeries.value.colors];
        }

        chartStore.updateConfig(
            chartType.value,
            seriesNames,
            dataStore.headers,
            dataStore.gridData,
            chartType.value === 'pie' ? selectedSeries : undefined,
            currentColours
        );
        // set brief timeout to allow chart to re-render
        setTimeout(() => {
            emit('loading', false);
        }, 100);
    }

    if (chartType.value === 'pie' && activeSeries.value?.colors) {
        for (let i = 0; i < activeSeries.value.colors.length; i++) {
            showPieColourPicker[i] = false;
        }
    }
};
</script>

<style scoped lang="scss">
:deep(.vacp-color-inputs),
:deep(.vacp-copy-button),
:deep(.vacp-range-input-label-text--hue) {
    display: none;
}

.colour-dropdown {
    height: 40px;
}

.select-arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black;
}

select {
    background-color: white !important;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none;
}

.selector {
    width: 100%;
    max-width: 300px;
}
</style>
