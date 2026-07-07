<template>
    <div>
        <div class="text-lg font-bold text-gray-700 mb-6">
            {{ $t('HACK.datatable.uploadConfig.title') }}
        </div>

        <!-- drag and drop zone -->
        <div
            class="upload-file flex flex-col items-center justify-center mt-2 p-4 sm:p-12 bg-gray-100 border-4 border-dashed border-gray-300"
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

            <div class="text-center">{{ $t('HACK.data.drag') }}</div>
            <div>{{ $t('HACK.label.or') }}</div>

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
                    accept=".json"
                    tabindex="-1"
                    :aria-label="$t('HACK.data.upload')"
                    :disabled="fileName !== ''"
                    @change="onFileUpload($event)"
                />
            </div>

            <div v-if="errorNum !== 0" class="mt-2 text-red-800">
                {{ errorMessage }}
            </div>
            <div class="mt-4 text-gray-600">{{ $t('HACK.datatable.uploadConfig.supported') }}</div>

            <div v-if="fileName" class="relative w-full max-w-sm">
                <input
                    class="border border-black box-border w-full mt-4 p-2 pr-6"
                    type="search"
                    readonly
                    v-model="fileName"
                    :aria-label="$t('HACK.data.filename')"
                />
                <span class="clear-btn absolute cursor-pointer" @click="clearFile">X</span>
            </div>
        </div>
        <div v-if="fileName" class="mb-8 p-4 border rounded bg-gray-50">
            <div class="text-lg font-bold text-gray-700 mb-2">
                {{ $t('HACK.datatable.uploadConfig.lang') }}
            </div>
            <div class="flex space-x-2">
                <button v-for="lang in langs" :key="lang" :class="getBtnClass(lang)" @click="selectedLang = lang">
                    {{ lang.toUpperCase() }}
                </button>
            </div>
        </div>

        <div class="mt-4 flex gap-4">
            <button
                class="bg-black text-white rounded border border-black hover:bg-gray-900 font-bold p-4"
                :class="{ 'disabled hover:bg-gray-400': !langFile }"
                :disabled="!langFile"
                @click="applyConfig"
            >
                {{ $t('HACK.datatable.uploadConfig.apply') }}
            </button>
            <button class="bg-white border border-black rounded hover:bg-gray-100 font-bold p-4" @click="emit('close')">
                {{ $t('HACK.label.cancel') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChartStore } from '../../stores/chartStore';
import { useDataStore } from '../../stores/dataStore';
import { useI18n } from 'vue-i18n';
import type { LangId } from '../../definitions';

const { t, locale } = useI18n();

const selectedLang = ref<LangId>('en');

const langs = computed<LangId[]>(() => {
    const current = locale.value as LangId;
    return current === 'fr' ? ['fr', 'en'] : ['en', 'fr'];
});

const getBtnClass = (lang: LangId) => [
    'px-4 py-2 rounded',
    selectedLang.value === lang ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
];

const emit = defineEmits(['close']);
const chartStore = useChartStore();
const dataStore = useDataStore();

const fileInput = ref<HTMLInputElement | null>(null);
const fileName = ref<string>('');
const langFile = ref<File | undefined>(undefined);

const errorNum = ref(0);

const errorMessages: Record<number, string> = {
    1: t('HACK.datatable.uploadConfig.unsupported'),
    2: t('HACK.datatable.uploadConfig.error.structure'),
    3: t('HACK.datatable.uploadConfig.error.series'),
    4: t('HACK.datatable.uploadConfig.error.categories'),
    5: t('HACK.datatable.uploadConfig.error.parse')
};

const errorMessage = computed(() => errorMessages[errorNum.value] ?? '');

const clearFile = () => {
    fileName.value = '';
    langFile.value = undefined;
    errorNum.value = 0;
    if (fileInput.value) fileInput.value.value = '';
};

const processFile = (file: File) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
        langFile.value = file;
        fileName.value = file.name;
        errorNum.value = 0;
    } else {
        langFile.value = undefined;
        fileName.value = '';
        errorNum.value = 1;
    }
};

const onFileUpload = (event: Event) => {
    const file = Array.from((event.target as HTMLInputElement).files as ArrayLike<File>)[0];
    if (file) processFile(file);
    if (fileInput.value) fileInput.value.value = '';
};

const uploadFile = (event: DragEvent) => {
    if (event.dataTransfer?.files[0]) {
        processFile(event.dataTransfer.files[0]);
    }
};

const applyConfig = async () => {
    if (!langFile.value) return;

    try {
        const text = await langFile.value.text();
        const parsed = JSON.parse(text);

        //check if the json structure is valid
        if (!parsed.xAxis || !Array.isArray(parsed.xAxis.categories) || !Array.isArray(parsed.series)) {
            errorNum.value = 2;
            return;
        }

        //check if number of series match
        if (parsed.series.length !== dataStore.headers.length - 1) {
            errorNum.value = 3;
            return;
        }

        //check if number of categories match
        if (parsed.xAxis.categories.length !== dataStore.gridData.length) {
            errorNum.value = 4;
            return;
        }
        errorNum.value = 0;

        //apply translations
        dataStore.applyLanguageConfig(parsed, selectedLang.value);
        chartStore.applyLanguageConfig(parsed, selectedLang.value);

        emit('close');
    } catch (err) {
        console.error(err);
        errorNum.value = 5;
    }
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
