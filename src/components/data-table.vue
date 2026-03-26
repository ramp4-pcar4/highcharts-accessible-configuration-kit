<template>
    <div>
        <div class="mt-4">{{ $t('HACK.data.modify') }}</div>
        <div class="flex flex-col sm:flex-row mt-4">
            <button
                class="bg-black text-white self-start border text-sm md:text-base rounded border-black hover:bg-gray-900 font-bold p-2 mb-2 sm:mb-0 overflow-visible mr-2"
                @click="emit('back')"
            >
                {{ $t('HACK.datatable.uploadNew') }}
            </button>

            <!-- Row and column actions -->
            <div class="ml-auto max-w-full">
                <select
                    class="border border-black p-2 rounded text-sm md:text-base bg-gray-100 focus:bg-white mb-2 mr-2 max-w-full"
                    v-model="rowAction"
                    @change="handleRowAction()"
                    :aria-label="$t('HACK.datatable.rowActions')"
                    :disabled="!Object.values(selectedRows).some((row) => row)"
                >
                    <option value="" hidden>{{ $t('HACK.datatable.rowActions') }}</option>
                    <!-- Enable insert when exactly one row is selected, enable delete when any number of rows are selected -->
                    <option
                        v-for="action in Object.keys(rowActions)"
                        :key="action"
                        :value="action"
                        :disabled="
                            action === 'delete'
                                ? !Object.values(selectedRows).some((row) => row)
                                : !(Object.values(selectedRows).filter((row) => row).length === 1)
                        "
                    >
                        {{ $t(`HACK.datatable.rowActions.${action}`) }}
                    </option>
                </select>

                <select
                    class="border border-black p-2 rounded text-sm md:text-base bg-gray-100 focus:bg-white max-w-full"
                    v-model="colAction"
                    @change="handleColAction()"
                    :aria-label="$t('HACK.datatable.colActions')"
                    :disabled="!Object.values(selectedCols).some((col) => col)"
                >
                    <option value="" hidden>{{ $t('HACK.datatable.colActions') }}</option>
                    <!-- Enable insert when exactly one col is selected, enable delete when any number of cols are selected -->
                    <option
                        v-for="action in Object.keys(colActions)"
                        :key="action"
                        :value="action"
                        :disabled="
                            action === 'delete'
                                ? !Object.values(selectedCols).some((col) => col)
                                : !(Object.values(selectedCols).filter((col) => col).length === 1)
                        "
                    >
                        {{ $t(`HACK.datatable.colActions.${action}`) }}
                    </option>
                </select>
            </div>
        </div>

        <LanguageTabs v-model:activeLang="chartStore.activeLang" :plugin="props.plugin" />
        <!-- Datatable -->
        <div class="overflow-x-auto">
            <table class="table-auto border-collapse border-dotted border border-black w-full mt-5">
                <thead>
                    <tr class="bg-gray-200">
                        <td class="border border-gray-500 w-16 p-2 text-left align-middle">
                            <input
                                type="checkbox"
                                :checked="allRowsSelected"
                                @click.stop
                                @change="toggleAllRows"
                                :aria-label="$t('HACK.datatable.selectAllRows')"
                            />
                        </td>
                        <td
                            class="border border-gray-500 p-2 text-left align-middle"
                            v-for="(header, colIdx) in headers"
                            :key="colIdx"
                            @click="editColHeader(colIdx)"
                        >
                            <div class="flex items-center w-full" style="cursor: text">
                                <input
                                    :ref="(el) => (headerInput[colIdx] = el as HTMLInputElement | null)"
                                    class="col-header max-w-[calc(100%-21px)] box-border border border-transparent font-bold p-1 bg-transparent focus:border-black focus:bg-white rounded-md"
                                    type="text"
                                    v-model="(headers[colIdx] as { [key: string]: string })[activeLang]"
                                    :aria-label="$t('HACK.datatable.colHeaders')"
                                    :style="{ width: Math.max(header.length + 2, 8) + 'ch' }"
                                    :readonly="editingHeader !== colIdx"
                                    @input="updateHeader(colIdx, headers[colIdx])"
                                    @focus="editColHeader(colIdx)"
                                    @blur="escEditCell"
                                    @keyup.enter="($event.target as HTMLElement).blur()"
                                />
                                <input
                                    class="ml-auto align-middle"
                                    type="checkbox"
                                    @click.stop
                                    v-model="selectedCols[colIdx]"
                                    :aria-label="$t('HACK.datatable.selectCol')"
                                />
                            </div>
                        </td>
                        <th
                            class="border cursor-pointer border-dotted border-gray-400 p-2 text-center text-gray-600 w-[25px]"
                            @click="addNewCol"
                        >
                            + {{ $t('HACK.datatable.addNewCol') }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="even:bg-gray-50" v-for="(row, rowIdx) in gridData" :key="rowIdx">
                        <td class="border border-gray-500 p-2 text-left">
                            <input
                                type="checkbox"
                                @click.stop
                                v-model="selectedRows[rowIdx]"
                                :aria-label="$t('HACK.datatable.selectRow')"
                            />
                        </td>
                        <td
                            class="grid-cell border border-gray-500 p-2 text-left align-middle"
                            v-for="(value, colIdx) in row"
                            :key="colIdx"
                            @click="editCell(rowIdx, colIdx, value)"
                        >
                            <div class="flex items-center w-full" style="cursor: text">
                                <input
                                    :ref="
                                        (el) =>
                                            (gridCellInput[rowIdx * headers.length + colIdx] =
                                                el as HTMLInputElement | null)
                                    "
                                    class="grid-cell max-w-[calc(100%-2px)] box-border border border-transparent bg-transparent p-1 focus:border-black focus:bg-white rounded-md"
                                    type="text"
                                    :value="getCellDisplayValue(rowIdx, colIdx)"
                                    :aria-label="$t('HACK.datatable.gridcells')"
                                    :style="{
                                        width:
                                            Math.max(getCellDisplayValue(rowIdx, colIdx).toString().length + 2, 8) +
                                            'ch'
                                    }"
                                    :readonly="editingCell.rowIdx !== rowIdx || editingCell.colIdx !== colIdx"
                                    @input="updateCell(rowIdx, colIdx, ($event.target as HTMLInputElement).value)"
                                    @focus="editCell(rowIdx, colIdx, getCellDisplayValue(rowIdx, colIdx))"
                                    @blur="escEditCell"
                                    @keyup.enter="($event.target as HTMLElement).blur()"
                                />
                            </div>
                        </td>
                        <td
                            class="border border-dotted border-gray-400 p-2"
                            :aria-label="$t('HACK.datatable.addNewCol')"
                        ></td>
                    </tr>
                    <tr :class="gridData.length % 2 === 0 ? '' : 'bg-gray-50'">
                        <td
                            class="border cursor-pointer border-dotted border-gray-400 p-2 text-center font-bold text-gray-600"
                            @click="addNewRow"
                        >
                            + {{ $t('HACK.datatable.addNewRow') }}
                        </td>
                        <td
                            v-for="(header, colIdx) in headers"
                            :key="colIdx"
                            class="border border-dotted border-gray-400 p-2"
                        ></td>
                        <td class="border border-dotted border-gray-400 p-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="font-bold mt-8">{{ $t('HACK.preview') }}</div>
        <!-- Preview of chart -->
        <div class="dv-chart-container items-stretch h-full w-full mt-2">
            <highchart :key="chartStore.refreshKey" :options="chartStore.resolvedChartConfig"></highchart>
        </div>

        <div class="flex items-center mt-4">
            <router-link class="ml-auto" :to="{ name: 'ChartType' }" v-if="!props.plugin">
                <button
                    class="bg-black rounded text-white border text-sm md:text-base border-black hover:bg-gray-900 font-bold p-4 ml-auto"
                >
                    {{ $t('HACK.datatable.templates') }}
                </button>
            </router-link>
            <button
                class="bg-black text-white rounded text-sm md:text-base border border-black hover:bg-gray-900 font-bold p-4 ml-auto"
                @click="emit('change-view', CurrentView.Template)"
                v-else
            >
                {{ $t('HACK.datatable.templates') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, inject, onBeforeUnmount, onMounted, nextTick } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { useChartStore } from '../stores/chartStore';
import { useI18n } from 'vue-i18n';
import { CurrentView } from '../definitions';
import type { LocalizedString } from '../definitions';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';

import LanguageTabs from './helpers/language-tabs.vue';

exporting(Highcharts);
exportData(Highcharts);
dataModule(Highcharts);

const { t } = useI18n();

const props = defineProps({
    uploadedFile: {
        type: File
    },
    pastedFile: {
        type: String
    },
    plugin: {
        type: Boolean
    },
    lang: {
        type: String
    }
});

const emit = defineEmits(['back', 'change-view']);

const $papa: any = inject('$papa');
const dataStore = useDataStore();
const chartStore = useChartStore();

const activeLang = computed(() => chartStore.activeLang);
const headers = computed(() => dataStore.headers);
const gridData = computed(() => dataStore.gridData);

const headerInput = ref<(HTMLInputElement | null)[]>([]);
const gridCellInput = ref<(HTMLInputElement | null)[]>([]);

const editingHeader = ref(-1);
const editingCell = ref({ rowIdx: -1, colIdx: -1 });
const editingVal = ref('');

let selectedRows = reactive({});
let selectedCols = reactive({});
const rowAction = ref<string>('');
const colAction = ref<string>('');
const allRowsSelected = computed(
    () =>
        gridData.value.length > 0 &&
        Object.keys(selectedRows).length === gridData.value.length &&
        Object.values(selectedRows).every((val) => val)
);

const toggleAllRows = () => {
    const shouldSelectAll = !allRowsSelected.value;
    for (let i = 0; i < gridData.value.length; i++) {
        selectedRows[i] = shouldSelectAll;
    }
};
const addNewRow = () => {
    dataStore.addNewRow(gridData.value.length - 1, true);
    chartStore.insertRow(gridData.value.length);
};
const addNewCol = () => {
    dataStore.addNewCol(headers.value.length - 1, true);
    chartStore.insertColumn(headers.value.length);
};
const rowActions: Record<string, string> = {
    delete: 'delete',
    insertAbove: 'insertAbove',
    insertBelow: 'insertBelow'
};

const colActions: Record<string, string> = {
    delete: 'delete',
    insertLeft: 'insertLeft',
    insertRight: 'insertRight'
};

onMounted(() => {
    const config = chartStore.chartConfig;
    let seriesArray: any[] = [];
    if (Array.isArray(config.series)) {
        seriesArray = config.series;
    } else if (config.series && 'data' in config.series && Array.isArray(config.series.data)) {
        seriesArray = config.series.data;
    }
    const isPieChart = seriesArray.length >= 1 && seriesArray[0].type === 'pie';

    if (props.uploadedFile || props.pastedFile) {
        // parse uploaded file or pasted data
        $papa.parse(props.uploadedFile || props.pastedFile, {
            header: true, // first row headers
            skipEmptyLines: true,
            complete: (res: any) => {
                const bilingualHeaders = (res.meta.fields || []).map((h: string) => ({ en: h, fr: h }));
                dataStore.setHeaders(bilingualHeaders);
                dataStore.setGridData(
                    res.data.map((row: any) =>
                        bilingualHeaders.map((header: any, colIdx: number) => {
                            const value = row[header.en] ?? '';
                            return colIdx === 0 ? { en: value, fr: value } : value;
                        })
                    )
                );
                // default preview of datatable to line graph
                const categories = dataStore.gridData.map((row) => row[0]);
                const seriesData = bilingualHeaders
                    .slice(1)
                    .map((_, colIdx) => dataStore.gridData.map((row) => parseFloat(row[colIdx + 1])));
                chartStore.setupConfig(bilingualHeaders.slice(1), categories, seriesData, bilingualHeaders[0]);

                // set a non-empty default chart title
                chartStore.chartConfig.title.text = {
                    en: chartStore.defaultTitle || t('HACK.customization.titles.chartTitle', {}, { locale: 'en' }),
                    fr: chartStore.defaultTitle || t('HACK.customization.titles.chartTitle', {}, { locale: 'fr' })
                };
            },
            error: (err: any) => {
                console.error('Error parsing file: ', err);
            }
        });
    } else if (Object.keys(chartStore.chartConfig).length > 0 && !isPieChart) {
        const config = chartStore.chartConfig;

        const headers = [config.xAxis.title.text || ''].concat(config.series.map((s) => s.name));
        dataStore.setHeaders(headers);

        const categories = config.xAxis?.categories || [];
        const seriesData = config.series.map((s) => s.data || []);

        const gridData = categories.map((cat, rowIdx) => {
            return [cat].concat(seriesData.map((s) => s[rowIdx] ?? ''));
        });

        dataStore.setGridData(gridData);
    } else {
        document.addEventListener('click', handleMouseClick);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleMouseClick);
});

// turn off grid edit inputs on mouse click
const handleMouseClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    // ignore if clicking on a grid cell element
    if (target.closest('.grid-cell') || target.closest('.col-header')) {
        return;
    } else {
        escEditCell();
    }
};

const editColHeader = (colIdx: number) => {
    escEditCell();
    editingHeader.value = colIdx;

    // focus the selected column header
    nextTick(() => {
        headerInput.value[colIdx]?.focus();
    });
};

const editCell = (rowIdx: number, colIdx: number, val: string) => {
    escEditCell();
    editingCell.value = { rowIdx: rowIdx, colIdx: colIdx };
    editingVal.value = val;

    // focus the selected grid cell input
    nextTick(() => {
        const cellIdx = rowIdx * headers.value.length + colIdx;
        gridCellInput.value[cellIdx]?.focus();
    });
};

const escEditCell = () => {
    editingHeader.value = -1;
    editingCell.value = { rowIdx: -1, colIdx: -1 };
    editingVal.value = '';
};

const updateHeader = (headerIdx: number, val: LocalizedString) => {
    chartStore.updateHeader(headerIdx, val);
};

const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const cell = dataStore.gridData[rowIdx][colIdx];

    if (colIdx === 0 && typeof cell === 'object') {
        cell[activeLang.value] = val;
    } else {
        dataStore.gridData[rowIdx][colIdx] = val;
    }

    dataStore.updateCell(rowIdx, colIdx, val, activeLang.value);
    // update chart config with new series value
    chartStore.updateVal(rowIdx, colIdx, val);
};

const getCellDisplayValue = (rowIdx: number, colIdx: number) => {
    const cell = dataStore.gridData[rowIdx][colIdx];

    if (colIdx === 0 && typeof cell === 'object') {
        return cell[activeLang.value];
    }
    return cell ?? '';
};

const handleRowAction = (): void => {
    const rowIdxs = Object.keys(selectedRows).filter((idx) => selectedRows[idx]);
    switch (rowAction.value) {
        case rowActions.delete: {
            dataStore.deleteRows(rowIdxs);
            chartStore.deleteRow(rowIdxs.map((rowIdx) => parseInt(rowIdx)));
            selectedRows = reactive({}); // reset the selections
            break;
        }
        case rowActions.insertBelow: {
            dataStore.addNewRow(rowIdxs[0], true);
            chartStore.insertRow(parseInt(rowIdxs[0]) + 1);
            break;
        }
        case rowActions.insertAbove: {
            dataStore.addNewRow(rowIdxs[0], false);
            chartStore.insertRow(parseInt(rowIdxs[0]));
            const newIdx = (parseInt(rowIdxs[0]) + 1).toString();
            selectedRows[rowIdxs[0]] = false;
            selectedRows[newIdx] = true; //reselect the previous selected row
            break;
        }
    }
    rowAction.value = '';
};

const handleColAction = (): void => {
    const colIdxs = Object.keys(selectedCols).filter((idx) => selectedCols[idx]);
    switch (colAction.value) {
        case colActions.delete: {
            dataStore.deleteCols(colIdxs);
            chartStore.deleteColumn(colIdxs.map((colIdx) => parseInt(colIdx)));
            selectedCols = reactive({}); // reset the selections
            break;
        }
        case colActions.insertRight: {
            dataStore.addNewCol(colIdxs[0], true);
            chartStore.insertColumn(parseInt(colIdxs[0]) + 1);
            break;
        }
        case colActions.insertLeft: {
            dataStore.addNewCol(colIdxs[0], false);
            chartStore.insertColumn(parseInt(colIdxs[0]));
            const newIdx = (parseInt(colIdxs[0]) + 1).toString();
            selectedCols[colIdxs[0]] = false;
            selectedCols[newIdx] = true; //reselect the previous selected col
            break;
        }
    }

    // clear col action selection
    colAction.value = '';
};
</script>

<style lang="scss">
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
