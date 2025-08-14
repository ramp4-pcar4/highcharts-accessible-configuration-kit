<template>
    <VueFinalModal
        modalId="hack-help-panel"
        content-class="bg-white w-5/6 sm:w-2/3 rounded-lg p-4 h-5/6 flex flex-col space-y-4"
        class="hack-help-panel flex justify-center items-center"
    >
        <header class="flex justify-between border-b pb-4 top-0 items-center">
            <h2 class="text-lg font-semibold">
                <span class="hidden sm:inline">{{ $t('HACK.help.title') }}</span>
                <span class="inline sm:hidden">{{ $t('HACK.help.title.mobile') }}</span>
            </h2>
            <button class="text-gray-500 hover:text-gray-900 font-black" @click="$vfm.close('hack-help-panel')">
                ✕
            </button>
        </header>

        <div class="help-section-headers pl-3 pr-3 overflow-y-auto flex-grow max-w-none">
            <div v-for="(section, i) in helpSections" :key="i">
                <div
                    tabindex="0"
                    class="cursor-pointer hover:bg-gray-100 mb-3 bg-gray-50 font-bold text-lg py-3 border-b flex"
                    @click="section.expanded = !section.expanded"
                    @keydown.enter.space.prevent="section.expanded = !section.expanded"
                    >
                    <!-- name -->
                    <span class="pl-3 text-xl text-left flex-grow">{{ section.header }}</span>

                    <!-- dropdown icon -->
                    <div class="dropdown-icon" :class="{ 'transform -rotate-180': section.expanded }">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                    </div>
                </div>
                <transition name="help-item" mode="out-in">
                    <div
                        v-if="section.expanded"
                        class="ramp-markdown pb-3 px-3 section-body overflow-hidden"
                        v-html="section.info"
                    ></div>
                </transition>
            </div>
        </div>
    </VueFinalModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import { marked } from 'marked';
// import axios from 'axios';
import { helpEnMd, helpImages } from '@/hack-help/assets';

marked.setOptions({ breaks: true });

export default defineComponent({
    name: 'HackHelpPanel',
    components: { VueFinalModal },
    data() {
        return {
            helpMd: '',
            helpSections: [] as { header: string; info: string; drawn: boolean; expanded: boolean }[],
            originalTextArray: [] as string[]
        };
    },

    mounted() {
        this.hackFetchMarkdown();
    },
    methods: {
        async hackFetchMarkdown(): Promise<void> {
            // const helpPath = `/hack-help/`;
            // const helpFile = `help-en.md`;
            console.log('got here. ');

            // axios.get(`${helpPath}${helpFile}`).then((r) => {
            const reg = /^#\s(.*)\n{2}(?:.+|\n(?!\n{2,}))*/gm;
            const renderer = new marked.Renderer();

            renderer.image = (token) => {
                let href = token.href;
                let text = token.text || '';

                const key = `./images/${href}`;
                const imageSrc = helpImages[key] || href;
                return `   <div style="max-width:100%; overflow-x:auto;">
      <img src="${imageSrc}" alt="${text}" style="display:block; max-width:none; width:auto; max-height:400px;" />
    </div>`;
            };

            this.helpMd = helpEnMd.replace(new RegExp(String.fromCharCode(13), 'g'), '');
            let section;
            while ((section = reg.exec(this.helpMd))) {
                const info_results = marked(section[0].split('\n').splice(2).join('\n'), { renderer }) as string;
                this.helpSections.push({
                    header: section[1],
                    info: info_results,
                    drawn: true,
                    expanded: false
                });
                // copy of the original text to refer to after highlighting
                this.originalTextArray.push(info_results);
            }
            // });
        }
    }
});
</script>
<style lang="scss" scoped>
.ramp-markdown :not(table, td, img) {
    all: revert;
}

.help-section-headers .dropdown-icon {
    transition: transform 0.3s cubic-bezier(0.35, 0, 0.25, 1);
}
</style>
