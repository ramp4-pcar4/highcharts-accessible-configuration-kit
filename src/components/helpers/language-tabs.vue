<template>
    <div class="mt-4">
        <div class="border-b border-gray-300">
            <!-- Base language (language of uploaded file) -->
            <button :class="tabClass(baseLang)" class="px-4 py-2" @click="$emit('update-lang', baseLang)">
                {{ $t(`HACK.lang.config.${baseLang}`) }}
            </button>

            <!-- Other language -->
            <button :class="tabClass(otherLang)" class="px-4 py-2 relative" @click="$emit('update-lang', otherLang)">
                {{ $t(`HACK.lang.config.${otherLang}`) }}
                <span class="ml-1 text-red-500">•</span>
            </button>
        </div>

        <div v-if="activeLang === baseLang" class="mt-1 text-yellow-700 flex items-center px-4 gap-1">
            {{
                $t('HACK.lang.config.translate', {
                    lang: $t(`HACK.lang.${otherLang}`)
                })
            }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDataStore } from '@/stores/dataStore';
import { computed } from 'vue';
const props = defineProps({
    activeLang: {
        type: String,
        required: true
    }
});

defineEmits(['update-lang']);

const dataStore = useDataStore();

const baseLang = computed(() => dataStore.uploadedFileLang);
const otherLang = computed(() => (baseLang.value === 'en' ? 'fr' : 'en'));

const tabClass = (lang: 'en' | 'fr') =>
    props.activeLang === lang ? 'border-b-2 border-blue-500 text-blue-500 font-bold' : 'text-gray-500';
</script>
