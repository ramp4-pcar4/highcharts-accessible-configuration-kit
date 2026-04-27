import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import DataSection from '@/components/data-section.vue';
import ChartSelection from '@/components/chart-selection.vue';
import ConfigCustomization from '@/components/config-customization.vue';

const routes = [
    {
        path: '/',
        redirect: (to: RouteLocationNormalized): RouteLocationRaw => {
            return '/data';
        }
    },
    {
        path: '/data',
        name: 'Data',
        component: DataSection
    },
    {
        path: '/chart',
        name: 'ChartType',
        component: ChartSelection
    },
    {
        path: '/customization',
        name: 'Customization',
        component: ConfigCustomization
    }
];

const router = createRouter({
    routes: routes,
    history: createWebHashHistory()
});

export default router;
