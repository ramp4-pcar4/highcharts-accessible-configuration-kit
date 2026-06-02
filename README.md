# Highcharts Accessible Configuration Kit

Highcharts Accessible Configuration Kit (HACK) is an intuitive, user-friendly [highcharts](https://api.highcharts.com/highcharts/) editor tool developed in Vue 3. HACK empowers users to transform their data source (.csv, .xlsx) into fully configured Highcharts configuration files. All basic chart types are supported in the editor alongside hybrid chart types, while allowing for chart customization options. The application is fully compliant with accessibility standards and allows for users to export ready-to-use Highcharts configuration files with no previous knowledge of the API. HACK is developed and maintained by the Web Mapping Team at Environment and Climate Change Canada.

## Plugin Usage

To use HACK as a plugin in your Vue 3 project, follow these steps:

**1. Install package from npm:**

```
npm install highcharts-accessible-configuration-kit
```

Note - other packages should also be installed in host application, listed below: 
- `vue-i18n`
- `pinia`
- `highcharts-vue`
- `vue-final-modal`
- `vue-papa-parse`

**2. Install the plugin in your Vue app:**

```
import { createApp } from 'vue';
import App from './app.vue';
const app = createApp(App);

import HighchartsAccessibleConfigurationKit from 'highcharts-accessible-configuration-kit';
import 'highcharts-accessible-configuration-kit/dist/highcharts-accessible-configuration-kit.css';
app.use(HighchartsAccessibleConfigurationKit);
```

**3. Merge `i18n` messages exported from the plugin:**

```
import { highchartsMessages } from 'highcharts-accessible-configuration-kit';
createI18n({
    ...,
    messages: {
        en: { ...appMessages.en, ...highchartsMessages.en },
        fr: { ...appMessages.fr, ...highchartsMessages.fr }
    }
});
```

**4. Use HACK component in your Vue templates, here is a demo snippet for usage:**

```
<highcharts-accessible-configuration-kit
    :key="`new-editor-${chartIdx}`"
    :plugin="true"
    :lang="'en'"
    :title="$t('editor.chart.label.newTitle')"
    @cancel="() => $vfm.close('highcharts-create-modal')"
    @saved="(chartConfig) => console.log('New chart config saved: ', chartConfig)"
/>

```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Demo Builds

When you push changes to your forked repo, a demo preview is automatically generated. The demo preview updates each time you push changes. Demo folders are deleted daily when the source branch or tag is deleted from your forked repo.

### Accessing Your Demo Previews

- **Branch or tag preview**: Visit `https://YOUR-GITHUB-USERNAME.github.io/highcharts-accessible-configuration-kit/BRANCH-OR-TAG-NAME` to see a live preview of the branch or tag you pushed.
- **List of all demos**: View all your demo previews by navigating to `https://github.com/YOUR-GITHUB-USERNAME/highcharts-accessible-configuration-kit/tree/demo-page`.

### Enabling Demos for Your Forked Repo

To enable demo previews on your forked repository, update the following settings: 

1. **GitHub Pages**: Go to `Settings -> Pages -> Build and deployment source` and select **GitHub Actions**.
2. **Deployment branches and tags**: Go to `Settings -> Environments -> github-pages -> Deployment branches and tags` and choose **No restriction**.
3. **Actions permissions**: Go to `Settings -> Actions -> General -> Actions permissions` and select **Allow all actions and reusable workflows**.
4. **Workflow permissions**: Go to `Settings -> Actions -> General -> Workflow permissions` and select **Read and write permissions**.
5. **Enable workflows**: Go to the `Actions` tab and click **I understand my workflows, go ahead and enable them**. If workflows are already enabled for your fork, this prompt will not appear.

