<template>
    <div :class="[{ hidden: hidePage }, 'data-section', 'md:m-6', 'm-2']">
        <div class="text-xl md:text-2xl font-bold">{{ $t('HACK.data.title') }}</div>
        <template v-if="!dataStore.datatableView">
            <div class="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                {{ $t('HACK.data.description') }}
                <button
                    v-if="!btnDisabled"
                    class="bg-white border border-black mt-2 rounded hover:bg-gray-100 font-bold p-4 sm:ml-auto"
                    @click="
                        () => {
                            dataStore.setDatatableView(true);
                            dataStore.toggleUploaded(true);
                        }
                    "
                    :disabled="btnDisabled"
                >
                    {{ $t('HACK.label.cancel') }}
                </button>
            </div>

            <!-- drag and drop section for importing data file -->
            <div
                class="upload-file flex flex-col items-center justify-center mt-8 p-4 sm:p-12 bg-gray-100 border-4 border-dashed border-gray-300"
                @drop.prevent="uploadFile($event)"
                @dragover.prevent
                @dragleave.prevent
            >
                <div class="align-middle pb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 -2 30 30">
                        <path
                            d="M599,692 C597.896,692 597,692.896 597,694 L597,698 L575,698 L575,694 C575,692.896 574.104,692 573,692 C571.896,692 571,692.896 571,694 L571,701 C571,701.479 571.521,702 572,702 L600,702 C600.604,702 601,701.542 601,701 L601,694 C601,692.896 600.104,692 599,692 L599,692 Z M582,684 L584,684 L584,693 C584,694.104 584.896,695 586,695 C587.104,695 588,694.104 588,693 L588,684 L590,684 C590.704,684 591.326,684.095 591.719,683.7 C592.11,683.307 592.11,682.668 591.719,682.274 L586.776,676.283 C586.566,676.073 586.289,675.983 586.016,675.998 C585.742,675.983 585.465,676.073 585.256,676.283 L580.313,682.274 C579.921,682.668 579.921,683.307 580.313,683.7 C580.705,684.095 581.608,684 582,684 L582,684 Z"
                            transform="translate(-571.000000, -676.000000)"
                        />
                    </svg>
                </div>
                <div class="text-center">
                    {{ $t('HACK.data.drag') }}
                </div>
                <div>
                    {{ $t('HACK.label.or') }}
                </div>

                <!-- file upload button -->
                <div class="mt-4">
                    <button
                        class="bg-white border rounded border-black hover:bg-gray-100 font-bold p-4"
                        :class="{ 'disabled hover:bg-gray-400': fileName }"
                        :disabled="fileName !== ''"
                        @click="fileInput?.click()"
                    >
                        {{ $t('HACK.data.upload') }}
                    </button>
                    <input
                        ref="fileInput"
                        type="file"
                        class="cursor-pointer"
                        @change="onFileUpload($event)"
                        accept=".csv,.xlsx,.xls"
                        tabindex="-1"
                        :aria-label="$t('HACK.data.upload')"
                        :disabled="fileName !== ''"
                    />
                </div>
                <div v-if="uploadError" class="mt-2 text-red-800">{{ $t('HACK.data.unsupported') }}</div>
                <div class="mt-4 text-gray-600">{{ $t('HACK.data.supported') }}</div>
                <div v-if="fileName">
                    <div class="relative w-full">
                        <input
                            class="border border-black box-border w-full mt-4 p-2 pr-6"
                            type="search"
                            readonly
                            v-model="fileName"
                            :aria-label="$t('HACK.data.filename')"
                        />
                        <span
                            class="clear-btn absolute cursor-pointer"
                            @click="
                                () => {
                                    fileName = '';
                                    dataFile = undefined;
                                    dataStore.toggleUploaded(false);
                                    chartStore.clearChartConfig();
                                }
                            "
                            >X</span
                        >
                    </div>
                    <div class="mt-4 text-gray-600">{{ $t('HACK.data.import.instructions') }}</div>
                </div>
            </div>

            <div v-if="fileName" class="mb-4 p-4 border rounded bg-gray-50">
                <div class="text-lg font-bold text-gray-700">
                    {{ $t('HACK.data.upload.lang') }}
                </div>
                <span class="inline-block mb-2 text-gray-600">
                    {{ $t('HACK.data.upload.lang.description') }}
                </span>

                <div class="flex space-x-2">
                    <button
                        v-for="lang in langs"
                        :key="lang"
                        :class="getBtnClass(lang)"
                        @click="(dataStore.setUploadedFileLang(lang), chartStore.setActiveLang(lang))"
                    >
                        {{ lang.toUpperCase() }}
                    </button>
                </div>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row gap-4">
                <button
                    class="bg-black text-white rounded border border-black hover:bg-gray-900 font-bold p-4"
                    :class="{ 'disabled hover:bg-gray-400': !fileName }"
                    :disabled="!fileName"
                    @click="
                        () => {
                            dataStore.setDatatableView(true);
                            dataStore.toggleUploaded(true);
                        }
                    "
                >
                    {{ $t('HACK.data.import') }}
                </button>
                <button
                    class="bg-white border border-black rounded sm:ml-auto hover:bg-gray-100 font-bold p-4"
                    @click="$vfm.open('paste-data')"
                    :class="{ 'disabled hover:bg-gray-400': fileName }"
                    :disabled="fileName !== ''"
                >
                    {{ $t('HACK.data.paste') }}
                </button>
            </div>

            <vue-final-modal
                modalId="paste-data"
                content-class="h-5/6 overflow-y-auto w-3/4 sm:w-2/3 mx-4 p-7 bg-white border rounded-lg"
                class="flex justify-center items-center"
            >
                <paste-data @import="parsePastedData" :pastedData="pastedData"></paste-data>
            </vue-final-modal>
        </template>

        <template v-else>
            <data-table
                :uploadedFile="dataFile"
                :pastedFile="pastedData"
                :lang="props.lang"
                :plugin="props.plugin"
                @back="
                    () => {
                        dataStore.setDatatableView(false);
                        dataStore.toggleUploaded(false);
                    }
                "
                @change-view="emit('change-view', CurrentView.Template)"
            ></data-table>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, onMounted } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { useDataStore } from '../stores/dataStore';
import { useChartStore } from '../stores/chartStore';
import { useSidemenuStore } from '../stores/sidemenuStore';
import { CurrentView } from '../definitions';

import PasteData from './helpers/paste-data.vue';
import DataTable from './data-table.vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['change-view']);

const props = defineProps({
    plugin: {
        type: Boolean
    },
    lang: {
        type: String
    }
});

const { locale } = useI18n();
const chartStore = useChartStore();
const dataStore = useDataStore();
const sidemenuStore = useSidemenuStore();

const dataFile = ref<File | undefined>(undefined);
const fileName = ref<string>('');
const pastedData = ref<string>('');

const fileInput = ref<HTMLInputElement | null>(null);

const btnDisabled = computed(() => Object.keys(chartStore.chartConfig).length === 0);

const uploadError = ref(false);
const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const isSmallScreen = ref(false);
const hidePage = computed(() => {
    return sidemenuStore.expanded && isSmallScreen.value;
});

const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 500;
};

const langs = computed<('en' | 'fr')[]>(() => {
    const current = locale.value as 'en' | 'fr';
    return current === 'fr' ? ['fr', 'en'] : ['en', 'fr'];
});

const getBtnClass = (lang: 'en' | 'fr') => [
    'px-4 py-2 rounded',
    dataStore.uploadedFileLang === lang ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
];

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    if (dataStore.gridData && dataStore.gridData.length) {
        dataStore.setDatatableView(true);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});

const onFileUpload = (event: Event) => {
    const uploadedFile = Array.from((event.target as HTMLInputElement).files as ArrayLike<File>)[0];

    if (uploadedFile && allowedTypes.includes(uploadedFile.type)) {
        dataFile.value = uploadedFile;
        fileName.value = uploadedFile.name;
        uploadError.value = false;
    } else {
        dataFile.value = undefined;
        uploadError.value = true;
    }

    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const uploadFile = (event: DragEvent) => {
    if (event.dataTransfer !== null) {
        if (allowedTypes.includes(event.dataTransfer.files[0].type)) {
            dataFile.value = event.dataTransfer.files[0];
            fileName.value = dataFile.value.name;
            uploadError.value = false;
        } else {
            dataFile.value = undefined;
            fileName.value = '';
            uploadError.value = true;
        }
    }
};

const parsePastedData = (content: string) => {
    pastedData.value = content;
    dataStore.setDatatableView(true);
    dataStore.toggleUploaded(true);
};
</script>

<style lang="scss">
.upload-file {
    input[type='file']:not(:focus-visible) {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.clear-btn {
    right: 10px;
    top: 50%;
    transform: translateY(-15%);
}
</style>
