<template>
    <div class="chart-customization-title">
        <div class="font-bold mt-6">
            {{ $t('HACK.customization.titles.chart') }} {{ activeLang === 'en' ? '(EN)' : '(FR)' }}
            <span class="font-normal text-red-600">{{ $t('HACK.customization.required') }}</span>
        </div>
        <input
            class="border text-sm md:text-base border-black box-border w-full mt-2 p-2 pr-6"
            :class="{ 'border-red-500': !chartConfig.title.text[activeLang] }"
            :placeholder="$t('HACK.customization.titles.placeholder')"
            :aria-label="$t('HACK.customization.titles.chart')"
            type="text"
            v-model="chartConfig.title.text[activeLang]"
        />

        <div class="font-bold mt-6">
            {{ $t('HACK.customization.titles.subtitle') }} {{ activeLang === 'en' ? '(EN)' : '(FR)' }}
        </div>
        <input
            class="border text-sm md:text-base border-black box-border w-full mt-2 p-2 pr-6"
            :placeholder="$t('HACK.customization.titles.placeholder')"
            :aria-label="$t('HACK.customization.titles.subtitle')"
            type="text"
            v-model="chartConfig.subtitle.text[activeLang]"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChartStore } from '../../stores/chartStore';

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);
const activeLang = computed(() => chartStore.activeLang);
</script>

<style lang="scss"></style>
