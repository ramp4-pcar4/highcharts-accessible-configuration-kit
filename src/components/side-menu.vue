<template>
    <nav
        id="highcharts-side-menu"
        :sidebar-expanded="sidemenuStore.expanded"
        :class="[sidemenuStore.expanded ? 'w-60' : 'w-12 sm:w-16', plugin ? 'self-stretch' : 'self-start standalone']"
        class="highcharts-side-menu duration-500 ease-in-out transition-width"
    >
        <div class="flex items-center mt-4 mb-12">
            <button
                class="flex items-center flex-shrink-0 md:px-2 py-1 mx-1 overflow-hidden"
                :aria-label="sidemenuStore.expanded ? $t('HACK.collapse') : $t('HACK.expand')"
                @click="sidemenuStore.expanded = !sidemenuStore.expanded"
                v-tippy="{
                    delay: '200',
                    placement: 'right',
                    content: sidemenuStore.expanded ? $t('HACK.collapse') : $t('HACK.expand'),
                    animateFill: true
                }"
            >
                <svg
                    class="flex-shrink-0"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="#707070"
                >
                    <path
                        class="transition-all duration-500 ease-in-out"
                        :d="`m3.5 7h${sidemenuStore.expanded ? '17' : '8.5'}`"
                    />
                    <path
                        class="transition-all duration-500 ease-in-out"
                        :d="`m3.5 12h${sidemenuStore.expanded ? '17' : '8.5'}`"
                    />
                    <path d="m3.5 17h17" />
                </svg>
            </button>
        </div>

        <ul class="side-nav-content">
            <li>
                <router-link
                    class="flex items-center md:px-2 my-6 mx-1"
                    :to="{ name: 'Data' }"
                    v-tippy="{
                        delay: '200',
                        placement: 'right',
                        content: $t('HACK.data.title'),
                        onShow: () => !sidemenuStore.expanded,
                        animateFill: true
                    }"
                    v-if="!plugin"
                >
                    <svg
                        class="flex-shrink-0"
                        :class="{ 'bg-gray-200 rounded-md': $route.name === 'Data' }"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 10V20M3 15L21 15M3 10H21M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </svg>
                    <span class="flex-1 ml-5 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                        $t('HACK.data.title')
                    }}</span>
                </router-link>
                <span
                    class="flex items-center md:px-2 my-6 mx-1"
                    v-tippy="{
                        delay: '200',
                        placement: 'right',
                        content: $t('HACK.data.title'),
                        onShow: () => !sidemenuStore.expanded,
                        animateFill: true
                    }"
                    tabindex="0"
                    role="button"
                    @click="emit('change-view', CurrentView.Data)"
                    v-else
                >
                    <svg
                        class="flex-shrink-0"
                        :class="{
                            'bg-gray-200 rounded-md': $route.name === 'Data' || pluginView === CurrentView.Data
                        }"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 10V20M3 15L21 15M3 10H21M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </svg>
                    <span class="flex-1 ml-5 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                        $t('HACK.data.title')
                    }}</span>
                </span>
            </li>
            <li>
                <router-link
                    class="flex items-center md:px-2 my-6 mx-1"
                    :class="{ disabled: btnDisabled }"
                    :tabIndex="btnDisabled ? -1 : 0"
                    :to="{ name: 'ChartType' }"
                    v-tippy="{
                        delay: '200',
                        placement: 'right',
                        content: $t('HACK.toc.chartType'),
                        onShow: () => !sidemenuStore.expanded,
                        animateFill: true
                    }"
                    v-if="!plugin"
                >
                    <svg
                        class="flex-shrink-0"
                        :class="{ 'bg-gray-200 rounded-md': $route.name === 'ChartType' }"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        stroke="#000000"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M3 14.6C3 14.0399 3 13.7599 3.10899 13.546C3.20487 13.3578 3.35785 13.2049 3.54601 13.109C3.75992 13 4.03995 13 4.6 13H5.4C5.96005 13 6.24008 13 6.45399 13.109C6.64215 13.2049 6.79513 13.3578 6.89101 13.546C7 13.7599 7 14.0399 7 14.6V19.4C7 19.9601 7 20.2401 6.89101 20.454C6.79513 20.6422 6.64215 20.7951 6.45399 20.891C6.24008 21 5.96005 21 5.4 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V14.6Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path
                            d="M10 4.6C10 4.03995 10 3.75992 10.109 3.54601C10.2049 3.35785 10.3578 3.20487 10.546 3.10899C10.7599 3 11.0399 3 11.6 3H12.4C12.9601 3 13.2401 3 13.454 3.10899C13.6422 3.20487 13.7951 3.35785 13.891 3.54601C14 3.75992 14 4.03995 14 4.6V19.4C14 19.9601 14 20.2401 13.891 20.454C13.7951 20.6422 13.6422 20.7951 13.454 20.891C13.2401 21 12.9601 21 12.4 21H11.6C11.0399 21 10.7599 21 10.546 20.891C10.3578 20.7951 10.2049 20.6422 10.109 20.454C10 20.2401 10 19.9601 10 19.4V4.6Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path
                            d="M17 10.6C17 10.0399 17 9.75992 17.109 9.54601C17.2049 9.35785 17.3578 9.20487 17.546 9.10899C17.7599 9 18.0399 9 18.6 9H19.4C19.9601 9 20.2401 9 20.454 9.10899C20.6422 9.20487 20.7951 9.35785 20.891 9.54601C21 9.75992 21 10.0399 21 10.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H18.6C18.0399 21 17.7599 21 17.546 20.891C17.3578 20.7951 17.2049 20.6422 17.109 20.454C17 20.2401 17 19.9601 17 19.4V10.6Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </svg>
                    <span class="flex-1 ml-5 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                        $t('HACK.toc.chartType')
                    }}</span>
                </router-link>
                <span
                    class="flex items-center md:px-2 my-6 mx-1"
                    :class="{ disabled: btnDisabled }"
                    :tabIndex="btnDisabled ? -1 : 0"
                    v-tippy="{
                        delay: '200',
                        placement: 'right',
                        content: $t('HACK.toc.chartType'),
                        onShow: () => !sidemenuStore.expanded,
                        animateFill: true
                    }"
                    role="button"
                    @click="emit('change-view', CurrentView.Template)"
                    v-else
                >
                    <svg
                        class="flex-shrink-0"
                        :class="{
                            'bg-gray-200 rounded-md': $route.name === 'ChartType' || pluginView === CurrentView.Template
                        }"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        stroke="#000000"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M3 14.6C3 14.0399 3 13.7599 3.10899 13.546C3.20487 13.3578 3.35785 13.2049 3.54601 13.109C3.75992 13 4.03995 13 4.6 13H5.4C5.96005 13 6.24008 13 6.45399 13.109C6.64215 13.2049 6.79513 13.3578 6.89101 13.546C7 13.7599 7 14.0399 7 14.6V19.4C7 19.9601 7 20.2401 6.89101 20.454C6.79513 20.6422 6.64215 20.7951 6.45399 20.891C6.24008 21 5.96005 21 5.4 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V14.6Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path
                            d="M10 4.6C10 4.03995 10 3.75992 10.109 3.54601C10.2049 3.35785 10.3578 3.20487 10.546 3.10899C10.7599 3 11.0399 3 11.6 3H12.4C12.9601 3 13.2401 3 13.454 3.10899C13.6422 3.20487 13.7951 3.35785 13.891 3.54601C14 3.75992 14 4.03995 14 4.6V19.4C14 19.9601 14 20.2401 13.891 20.454C13.7951 20.6422 13.6422 20.7951 13.454 20.891C13.2401 21 12.9601 21 12.4 21H11.6C11.0399 21 10.7599 21 10.546 20.891C10.3578 20.7951 10.2049 20.6422 10.109 20.454C10 20.2401 10 19.9601 10 19.4V4.6Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                        <path
                            d="M17 10.6C17 10.0399 17 9.75992 17.109 9.54601C17.2049 9.35785 17.3578 9.20487 17.546 9.10899C17.7599 9 18.0399 9 18.6 9H19.4C19.9601 9 20.2401 9 20.454 9.10899C20.6422 9.20487 20.7951 9.35785 20.891 9.54601C21 9.75992 21 10.0399 21 10.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H18.6C18.0399 21 17.7599 21 17.546 20.891C17.3578 20.7951 17.2049 20.6422 17.109 20.454C17 20.2401 17 19.9601 17 19.4V10.6Z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </svg>
                    <span class="flex-1 ml-5 overflow-hidden leading-normal overflow-ellipsis whitespace-nowrap">{{
                        $t('HACK.toc.chartType')
                    }}</span>
                </span>
            </li>
            <li>
                <router-link
                    class="flex items-start md:px-2 my-6 mx-1"
                    :class="{ disabled: btnDisabled }"
                    :tabIndex="btnDisabled ? -1 : 0"
                    :to="{ name: 'Customization' }"
                    v-tippy="{
                        delay: '200',
                        placement: 'right',
                        content: $t('HACK.toc.chartCustomize'),
                        onShow: () => !sidemenuStore.expanded,
                        animateFill: true
                    }"
                    v-if="!plugin"
                >
                    <svg
                        class="flex-shrink-0"
                        :class="{ 'bg-gray-200 rounded-md': $route.name === 'Customization' }"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#000000"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M2 6c0-1.505.78-3.08 2-4 0 .845.69 2 2 2 1.657 0 3 1.343 3 3 0 .386-.08.752-.212 1.09.74.594 1.476 1.19 2.19 1.81L8.9 11.98c-.62-.716-1.214-1.454-1.807-2.192C6.753 9.92 6.387 10 6 10c-2.21 0-4-1.79-4-4zm12.152 6.848l1.34-1.34c.607.304 1.283.492 2.008.492 2.485 0 4.5-2.015 4.5-4.5 0-.725-.188-1.4-.493-2.007L18 9l-2-2 3.507-3.507C18.9 3.188 18.225 3 17.5 3 15.015 3 13 5.015 13 7.5c0 .725.188 1.4.493 2.007L3 20l2 2 6.848-6.848c1.885 1.928 3.874 3.753 5.977 5.45l1.425 1.148 1.5-1.5-1.15-1.425c-1.695-2.103-3.52-4.092-5.448-5.977z"
                        ></path>
                    </svg>
                    <span class="flex-1 ml-5 leading-normal overflow-ellipsis">{{
                        $t('HACK.toc.chartCustomize')
                    }}</span>
                </router-link>
                <span
                    class="flex items-start rounded md:px-2 my-6 mx-1"
                    :class="{ disabled: btnDisabled }"
                    :tabIndex="btnDisabled ? -1 : 0"
                    :to="{ name: 'Customization' }"
                    v-tippy="{
                        delay: '200',
                        placement: 'right',
                        content: $t('HACK.toc.chartCustomize'),
                        onShow: () => !sidemenuStore.expanded,
                        animateFill: true
                    }"
                    role="button"
                    @click="emit('change-view', CurrentView.Customization)"
                    v-else
                >
                    <svg
                        class="flex-shrink-0"
                        :class="{
                            'bg-gray-200 rounded-md':
                                $route.name === 'Customization' || pluginView === CurrentView.Customization
                        }"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="#000000"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M2 6c0-1.505.78-3.08 2-4 0 .845.69 2 2 2 1.657 0 3 1.343 3 3 0 .386-.08.752-.212 1.09.74.594 1.476 1.19 2.19 1.81L8.9 11.98c-.62-.716-1.214-1.454-1.807-2.192C6.753 9.92 6.387 10 6 10c-2.21 0-4-1.79-4-4zm12.152 6.848l1.34-1.34c.607.304 1.283.492 2.008.492 2.485 0 4.5-2.015 4.5-4.5 0-.725-.188-1.4-.493-2.007L18 9l-2-2 3.507-3.507C18.9 3.188 18.225 3 17.5 3 15.015 3 13 5.015 13 7.5c0 .725.188 1.4.493 2.007L3 20l2 2 6.848-6.848c1.885 1.928 3.874 3.753 5.977 5.45l1.425 1.148 1.5-1.5-1.15-1.425c-1.695-2.103-3.52-4.092-5.448-5.977z"
                        ></path>
                    </svg>
                    <span class="flex-1 ml-5 leading-normal overflow-ellipsis">{{
                        $t('HACK.toc.chartCustomize')
                    }}</span>
                </span>
            </li>
        </ul>

        <div v-show="sidemenuStore.expanded">
            <!-- Import button -->
            <button
                class="flex bg-black text-white rounded justify-center border border-black w-full hover:bg-gray-900 font-bold px-4 py-2 my-2"
                tabindex="0"
                :aria-label="$t('HACK.toc.importChart')"
                @click="uploadHighchartsConfig"
            >
                <svg
                    class="flex-shrink-0 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    stroke="#FFFFFF"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12.5 17L12.5 4M12.5 4L18 8.78947M12.5 4L7 8.78947"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path d="M6 21H19" stroke-width="2" stroke-linecap="round"></path>
                </svg>
                {{ $t('HACK.toc.importChart') }}
            </button>
            <input
                ref="highchartsInput"
                type="file"
                accept=".json"
                class="hidden"
                tabindex="-1"
                :aria-label="$t('HACK.toc.importChart')"
                @change="handleConfigFileUpload"
            />
            <!-- Export/download button -->
            <ChartExport :in-header="false" />
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { useChartStore } from '../stores/chartStore';
import { useSidemenuStore } from '../stores/sidemenuStore';
import { CurrentView } from '../definitions';

import ChartExport from './helpers/chart-export.vue';

const emit = defineEmits(['change-view']);

defineProps({
    plugin: {
        type: Boolean
    },
    lang: {
        type: String
    },
    pluginView: {
        type: String
    }
});

const chartStore = useChartStore();
const dataStore = useDataStore();
const sidemenuStore = useSidemenuStore();
const uploaded = computed(() => dataStore.uploaded);
const btnDisabled = computed(() => {
    const chartKeys = Object.keys(chartStore.chartConfig);
    const onlyContextMenu = chartKeys.length === 1 && chartKeys[0] === 'lang';
    return (!uploaded.value && (chartKeys.length === 0 || onlyContextMenu)) || dataStore.datatableView === false;
});

const highchartsInput = ref<HTMLInputElement | null>(null);

// upload an existing highcharts configured JSON
const uploadHighchartsConfig = () => {
    (highchartsInput.value as HTMLInputElement).click();
};

// handle uploaded highcharts config file
const handleConfigFileUpload = (event: Event) => {
    const configFile = Array.from((event.target as HTMLInputElement).files as ArrayLike<File>)[0];
    if (!configFile) {
        return;
    }
    // TODO: add file validation

    const reader = new FileReader();
    reader.onload = (e) => {
        const res = JSON.parse(e.target?.result as string);
        chartStore.setChartConfig(res);
        // extract data from the config file
        dataStore.extractGridData(chartStore.chartConfig);
    };
    reader.readAsText(configFile);

    // clear input
    (event.target as HTMLInputElement).value = '';
    dataStore.setDatatableView(true);
};
</script>

<style lang="scss">
.highcharts-side-menu {
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    top: 60px;
    min-height: calc(100dvh - 60px);
}

.highcharts-side-menu.standalone {
    height: calc(100dvh - 60px);
    position: sticky;
}

.side-nav-content {
    overflow-y: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
}

.side-nav-content::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
