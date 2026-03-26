<template>
    <div class="mt-4">
        <div class="flex items-center border-b border-gray-300">
            <!-- Language tabs: only show when bilingual is enabled (default off for plugin) -->
            <template v-if="chartStore.isBilingual">
                <!-- Base language (language of uploaded file) -->
                <button :class="tabClass(baseLang)" class="px-4 py-2" @click="$emit('update:activeLang', baseLang)">
                    {{ $t(`HACK.lang.config.${baseLang}`) }}
                </button>

                <!-- Other language -->
                <button
                    :class="tabClass(otherLang)"
                    class="px-4 py-2 relative"
                    @click="$emit('update:activeLang', otherLang)"
                >
                    {{ $t(`HACK.lang.config.${otherLang}`) }}
                    <span class="ml-1 text-red-500">•</span>
                </button>
            </template>

            <!-- Bilingual toggle button, only show if it's used as plugin -->
            <div
                v-if="props.plugin"
                :class="['ml-auto flex items-center gap-2', !chartStore.isBilingual ? 'mb-2' : '']"
            >
                <span class="font-semibold">{{ $t('HACK.lang.config.bilingual') }}:</span>
                <button
                    class="bg-white border rounded px-2 py-1 text-sm hover:bg-gray-100 font-bold button-uppercase"
                    @click="
                        ((chartStore.isBilingual = !chartStore.isBilingual),
                        chartStore.setActiveLang(dataStore.uploadedFileLang))
                    "
                >
                    {{
                        chartStore.isBilingual
                            ? $t('HACK.lang.config.bilingual.on')
                            : $t('HACK.lang.config.bilingual.off')
                    }}
                </button>
            </div>
        </div>

        <!-- Warning message -->
        <div
            v-if="chartStore.isBilingual && activeLang === baseLang && chartStore.showLangWarning"
            class="mt-1 text-yellow-700 flex items-center px-4 gap-2"
        >
            {{ $t('HACK.lang.config.translate', { lang: $t(`HACK.lang.${otherLang}`) }) }}
            <button
                class="text-gray-500 hover:text-gray-700"
                @click="chartStore.showLangWarning = false"
                :aria-label="$t('HACK.lang.config.dismiss')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChartStore } from '@/stores/chartStore';
import { useDataStore } from '@/stores/dataStore';
import { computed } from 'vue';
import type { LangId } from '@/definitions';

const props = defineProps({
    activeLang: {
        type: String
    },
    plugin: {
        type: Boolean
    }
});

defineEmits(['update:activeLang']);

const chartStore = useChartStore();
const dataStore = useDataStore();

const baseLang = computed(() => dataStore.uploadedFileLang);
const otherLang = computed(() => (baseLang.value === 'en' ? 'fr' : 'en'));

const tabClass = (lang: LangId) =>
    props.activeLang === lang ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-500';
</script>

<style lang="css" scoped>
.button-uppercase {
    text-transform: uppercase;
}
</style>
