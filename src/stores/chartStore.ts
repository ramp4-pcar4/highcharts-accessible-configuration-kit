import { defineStore } from 'pinia';
import Highcharts from 'highcharts';
import PatternFill from 'highcharts/modules/pattern-fill';
import { ExportMenuOptions, HighchartsConfig, SeriesData } from '../definitions';
import type { LangId, LocalizedString } from '../definitions';
import type { PatternObject } from 'highcharts';

PatternFill(Highcharts);
const chartTemplates: Record<string, string> = {
    area: 'area',
    bar: 'bar',
    column: 'column',
    line: 'line',
    pie: 'pie',
    scatter: 'scatter',
    spline: 'spline'
};

export const useChartStore = defineStore('chartProperties', {
    state: () => ({
        chartType: 'line' as string,
        refreshKey: 0 as number,
        defaultTitle: '' as string,
        hybridChartType: '' as string,
        chartSeries: [] as string[],
        chartConfig: {} as HighchartsConfig,
        selectedHybridSeries: [] as string[],
        defaultColours: [
            '#0072B2',
            '#E69F00',
            '#009E73',
            '#D55E00',
            '#CC79A7',
            '#F0E442',
            '#56B4E9',
            '#4D4D4D',
            '#FF6F61',
            '#6B5B95',
            '#88B04B',
            '#F7CAC9'
        ],
        usePatterns: true,
        pieBaseColours: [] as string[],
        activeLang: 'en' as LangId
    }),
    getters: {
        resolvedChartConfig(): HighchartsConfig {
            const activeLang = this.activeLang;
            const config = JSON.parse(JSON.stringify(this.chartConfig));

            const resolve = (value: any): any => {
                if (value === null || typeof value !== 'object') return value;
                if ('en' in value && 'fr' in value) return value[activeLang];
                const copy: any = Array.isArray(value) ? [] : {};
                for (const key in value) {
                    copy[key] = resolve(value[key]);
                }
                return copy;
            };
            return resolve(config);
        }
    },

    actions: {
        /** Reset store to initial state */
        resetStore(): void {
            this.chartType = 'line';
            this.defaultTitle = '';
            this.hybridChartType = '';
            this.chartSeries = [];
            this.chartConfig = {} as HighchartsConfig;
            this.selectedHybridSeries = [];
            this.defaultColours = [
                '#0072B2',
                '#E69F00',
                '#009E73',
                '#D55E00',
                '#CC79A7',
                '#F0E442',
                '#56B4E9',
                '#4D4D4D',
                '#FF6F61',
                '#6B5B95',
                '#88B04B',
                '#F7CAC9'
            ];
        },

        /** Set active language */
        setActiveLang(lang: LangId) {
            this.activeLang = lang;
        },

        /** Set highcharts type */
        setChartType(chartType: string): void {
            this.chartType = chartType;
        },

        /** Set hybrid highcharts type */
        setHybridChartType(chartType: string): void {
            this.hybridChartType = chartType;
        },

        /** Set default title for highcharts */
        setDefaultTitle(title: string): void {
            this.defaultTitle = title;
        },

        /** Clear highcharts config */
        clearChartConfig(): void {
            this.chartConfig = {};
        },

        /** Set context/export menu strings */
        setMenuOptions(menuOptions: ExportMenuOptions): void {
            this.chartConfig.lang = menuOptions;
        },

        /** Set highcharts config (from imported json file) */
        setChartConfig(chartConfig: HighchartsConfig): void {
            // add mandatory fields blank (for customization section)
            // TODO: tons of edge cases here depending on the complexity of a chart configuration
            this.chartConfig = {
                ...chartConfig,
                title: {
                    text: this.toBilingual(chartConfig.title?.text ?? '')
                },
                subtitle: {
                    text: this.toBilingual(chartConfig.subtitle?.text ?? '')
                },
                xAxis: {
                    ...chartConfig.xAxis,
                    categories: Array.isArray(chartConfig.xAxis?.categories)
                        ? chartConfig.xAxis.categories.map((cat) =>
                              typeof cat === 'string' ? { en: cat, fr: cat } : cat
                          )
                        : Array.from({ length: chartConfig.series?.[0]?.data?.length || 0 }, () => ({
                              en: '',
                              fr: ''
                          })),
                    title: {
                        text: this.toBilingual(chartConfig.xAxis?.title?.text ?? '')
                    }
                },
                yAxis: Array.isArray(chartConfig.yAxis)
                    ? chartConfig.yAxis
                    : {
                          ...chartConfig.yAxis,
                          title: {
                              text: this.toBilingual(chartConfig.yAxis?.title?.text ?? '')
                          }
                      },
                series: ((chartConfig.series as SeriesData[]) || []).map((series) => ({
                    ...series,
                    name: this.toBilingual(series.name ?? ''),
                    type: series.type || '',
                    color: series.color || '',
                    dashStyle: series.dashStyle || '',
                    marker: {
                        ...series.marker,
                        symbol: series.marker?.symbol || ''
                    }
                }))
            };

            // handle special case for highcharts configs using data property
            if (chartConfig.data && chartConfig.data.csv) {
                this.convertCsvToSeries();
            }
        },

        /** Convert CSV data to series data in config */
        convertCsvToSeries(): void {
            // split CSV string into lines
            const lines = this.chartConfig.data?.csv.trim().split('\n') as string[];
            const header = lines[0].split(';').map((h) => h.replace(/"/g, '').trim());
            const categories = header.slice(1);

            // extract series data in the format "name;val1;val2"
            const seriesData = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(';').map((val: string) => val.trim());
                const seriesName = values[0];
                seriesData.push({
                    name: this.toBilingual(seriesName),
                    data: values.slice(1).map((val: string) => parseInt(val)),
                    type: 'line',
                    color: this.defaultColours[i - 1],
                    dashStyle: 'solid',
                    marker: {
                        symbol: 'circle'
                    }
                });
            }

            // fill in extracted values (catos, x-axis title, series data) into chart config
            this.chartConfig.xAxis = {
                categories: categories.map((cat) => ({ en: String(cat), fr: String(cat) })),
                title: {
                    text: { en: header[0] || '', fr: header[0] || '' }
                }
            };
            this.chartConfig.series = seriesData;
            delete this.chartConfig.data;
        },

        /** Set default highcharts config */
        setupConfig(
            seriesNames: LocalizedString[],
            cats: string[],
            seriesData: number[][],
            categoryLabel = { en: '', fr: '' }
        ): void {
            this.chartConfig = {
                title: {
                    text: { en: '', fr: '' }
                },
                subtitle: {
                    text: { en: '', fr: '' }
                },
                xAxis: {
                    categories: cats.map((cat: any) =>
                        typeof cat === 'string'
                            ? { en: cat, fr: cat }
                            : {
                                  en: cat.en || '',
                                  fr: cat.fr || ''
                              }
                    ),
                    title: {
                        text: categoryLabel
                    }
                },
                yAxis: {
                    title: {
                        text: { en: '', fr: '' }
                    }
                },
                series: seriesNames.map((name, index) => ({
                    name: name,
                    type: 'line',
                    color: this.defaultColours[index],
                    dashStyle: 'solid',
                    marker: {
                        symbol: 'circle'
                    },
                    data: seriesData[index]
                }))
            };
            this.setChartType('line');
        },

        /** Update highcharts configuration for chart type */
        updateConfig(
            type: string,
            series: LocalizedString[],
            headers: LocalizedString[],
            gridData: string[][],
            selectedSeries?: string,
            currentColours?: string[]
        ): void {
            this.chartConfig.tooltip = {};
            switch (type) {
                case chartTemplates.area: {
                    this.setChartType('area');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateAreaChart(series, seriesData);
                    break;
                }
                case chartTemplates.bar: {
                    this.setChartType('bar');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateBarChart(series, seriesData);
                    break;
                }
                case chartTemplates.column: {
                    this.setChartType('column');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateColumnChart(series, seriesData);
                    break;
                }
                case chartTemplates.line: {
                    this.setChartType('line');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateLineChart(series, seriesData);
                    break;
                }
                case chartTemplates.scatter: {
                    this.setChartType('scatter');
                    // TODO (if need to support coords format data):
                    // check if there exist categories (string values as first col) or if data is formatted as points in (x, y)
                    // const firstColNumeric = gridData.every((row) => !isNaN(parseFloat(row[0])));
                    // if (firstColNumeric && headers.length === 2) {
                    //     const seriesData = gridData.map((row) => ({
                    //         x: parseFloat(row[0]),
                    //         y: parseFloat(row[1])
                    //     }));
                    //     const seriesNames = Object.values(headers).slice(1);
                    //     this.updateScatterPlot(seriesNames, seriesData);
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));
                    this.updateScatterPlot(series, seriesData);

                    break;
                }
                case chartTemplates.spline: {
                    this.setChartType('spline');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateSplineChart(series, seriesData);
                    break;
                }
                case chartTemplates.pie: {
                    this.setChartType('pie');
                    const selectedSeriesIndex = headers.indexOf(selectedSeries || series[0]);
                    const data = gridData.map((row) => ({
                        name: row[0],
                        y: parseFloat(row[selectedSeriesIndex])
                    }));
                    const colours = currentColours && currentColours.length > 0 ? currentColours : undefined;
                    const seriesNames = Object.values(headers).slice(1);
                    this.updatePieChart(seriesNames, selectedSeriesIndex - 1, data, colours);
                    break;
                }
            }
        },

        /** Update data series after deleting row(s) */
        deleteRow(rowIdxs: number[]): void {
            const sortedRowIdxs = [...rowIdxs].sort((a, b) => b - a);
            // assuming all indices are valid
            sortedRowIdxs.forEach((rowIdx: number) => {
                this.chartConfig.xAxis.categories.splice(rowIdx, 1);
                this.chartConfig.series.forEach((series: SeriesData) => {
                    series.data?.splice(rowIdx, 1);
                });
                this.pieBaseColours.splice(rowIdx, 1);
            });
        },

        /** Update data series after deleting column(s) */
        deleteColumn(colIdxs: number[]): void {
            const sortedColIdxs = [...colIdxs].sort((a, b) => b - a);
            sortedColIdxs.forEach((colIdx: number) => {
                this.chartConfig.series.splice(colIdx - 1, 1);
            });
        },

        /** Update data series after inserting row */
        insertRow(rowIdx: number): void {
            if (this.chartType === 'pie') {
                const series = this.chartConfig.series[0];
                const newColor = this.defaultColours[this.pieBaseColours.length % this.defaultColours.length];
                (series.data as { name: string; y: number; color: string }[]).splice(rowIdx, 0, {
                    name: '',
                    y: 0,
                    color: newColor
                });
                this.pieBaseColours.splice(rowIdx, 0, newColor);
                this.applyPatterns();
            } else {
                this.chartConfig.xAxis.categories.splice(rowIdx, 0, '');
                this.chartConfig.series.forEach((series: SeriesData) => {
                    series.data?.splice(rowIdx, 0, 0);
                });
            }
        },

        /** Update data series after inserting column */
        insertColumn(colIdx: number): void {
            const defaultData = new Array(this.chartConfig.xAxis.categories.length).fill(0);
            const newSeries: SeriesData = {
                name: { en: 'Untitled', fr: 'Sans titre' },
                type: this.chartType,
                color: this.defaultColours[colIdx],
                dashStyle: 'solid',
                marker: {
                    symbol: 'circle'
                },
                data: defaultData
            };
            (this.chartConfig.series as SeriesData[]).splice(colIdx - 1, 0, newSeries);
        },

        /** Update header (series names) value */
        updateHeader(colIdx: number, name: LocalizedString): void {
            if (colIdx === 0) {
                this.chartConfig.xAxis.title.text = name;
            } else if (Array.isArray(this.chartConfig.series)) {
                const series = this.chartConfig.series[colIdx - 1];
                if (!series) return;

                if (typeof series.name === 'string') {
                    series.name = { en: series.name, fr: series.name };
                }
                series.name[this.activeLang] = name[this.activeLang];
            }
        },

        /** Update a single series value after data grid cell has been modified */
        updateVal(rowIdx: number, colIdx: number, val: string): void {
            if (this.chartConfig.series[0].type === 'pie') {
                if (colIdx === 0) {
                    const dataPoint = this.chartConfig.series[0].data[rowIdx];
                    if (typeof dataPoint.name === 'string') {
                        dataPoint.name = { en: dataPoint.name, fr: dataPoint.name };
                    }
                    dataPoint.name[this.activeLang] = val;

                    const cat = this.chartConfig.xAxis.categories[rowIdx];
                    if (typeof cat === 'string') {
                        this.chartConfig.xAxis.categories[rowIdx] = { en: cat, fr: cat };
                    }
                    (this.chartConfig.xAxis.categories[rowIdx] as any)[this.activeLang] = val;
                } else if (colIdx === 1) {
                    this.chartConfig.series[0].data[rowIdx].y = parseFloat(val);
                }
            } else {
                if (colIdx) {
                    this.chartConfig.series[colIdx - 1].data[rowIdx] = parseInt(val);
                } else {
                    const cat = this.chartConfig.xAxis.categories[rowIdx];
                    if (typeof cat === 'string') {
                        this.chartConfig.xAxis.categories[rowIdx] = { en: cat, fr: cat };
                    }
                    (this.chartConfig.xAxis.categories[rowIdx] as any)[this.activeLang] = val;
                }
            }
        },

        /** Update highcharts configuration for line chart */
        updateLineChart(seriesNames: LocalizedString[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.some((name) => name[this.activeLang] === series.name[this.activeLang])
                    ? {
                          name: series.name,
                          type: 'line',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /** Update highcharts configuration for bar chart */
        updateBarChart(seriesNames: LocalizedString[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.some((name) => name[this.activeLang] === series.name[this.activeLang])
                    ? {
                          name: series.name,
                          type: 'bar',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: {
                              symbol: 'circle'
                          },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /** Update highcharts configuration for scatter plot */
        updateScatterPlot(seriesNames: LocalizedString[], seriesData: { x: number; y: number }[] | number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.some((name) => name[this.activeLang] === series.name[this.activeLang])
                    ? {
                          name: series.name,
                          type: 'scatter',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
            // customize tooltip
            this.chartConfig.tooltip = {
                useHTML: true,
                headerFormat: '<span style="font-size: 10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td><span style="color:{series.color}">\u25CF</span> {series.name}: </td>' +
                    '<td style="text-align: right"><b> {point.y}</b></td></tr>',
                footerFormat: '</table>'
            };
        },

        /** Update highcharts configuration for column chart */
        updateColumnChart(seriesNames: LocalizedString[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.some((name) => name[this.activeLang] === series.name[this.activeLang])
                    ? {
                          name: series.name,
                          type: 'column',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: {
                              symbol: 'circle'
                          },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /** Update highcharts configuration for area chart */
        updateAreaChart(seriesNames: LocalizedString[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.some((name) => name[this.activeLang] === series.name[this.activeLang])
                    ? {
                          name: series.name,
                          type: 'area',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /** Update highcharts configuration for spline chart */
        updateSplineChart(seriesNames: LocalizedString[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.some((name) => name[this.activeLang] === series.name[this.activeLang])
                    ? {
                          name: series.name,
                          type: 'spline',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /** Update highcharts configuration for pie chart */
        updatePieChart(
            seriesNames: LocalizedString[],
            seriesIndex: number,
            seriesData: { name: string; y: number }[],
            currentColours?: string[]
        ): void {
            // following would support pie chart as part of hybrid charts
            // this.chartConfig.series = this.chartConfig.series.map((series, index) =>
            //     seriesNames.includes(series.name) ? { name: seriesNames[0], type: 'pie', data: seriesData[index] } : series
            // );

            this.chartConfig.series = this.chartConfig.series.map((series, index) => {
                if (index === seriesIndex) {
                    return {
                        name: seriesNames[seriesIndex],
                        type: 'pie',
                        data: seriesData,
                        colors: currentColours || this.defaultColours.slice(0, seriesData.length)
                    };
                } else {
                    return {
                        ...series,
                        data: [],
                        type: 'pie',
                        visible: false
                    };
                }
            });
            const base = currentColours && currentColours.length > 0 ? currentColours : this.defaultColours;

            this.pieBaseColours = Array.from({ length: seriesData.length }, (_, i) => base[i % base.length]);
            if (this.usePatterns) {
                this.applyPatterns();
            }

            this.chartConfig.legend = { enabled: false };
        },
        getDarkerColour(hex: string, factor: number): string {
            return (
                '#' +
                [1, 3, 5]
                    .map((startIdx) => {
                        const colorNum = Math.round(parseInt(hex.slice(startIdx, startIdx + 2), 16) * factor);
                        return colorNum.toString(16).padStart(2, '0');
                    })
                    .join('')
            );
        },

        getPieColours(colours: string[]): (string | PatternObject)[] {
            if (!this.usePatterns) return colours;
            return colours.map((color, i) => ({
                pattern: {
                    path: this.getPatternPath(i),
                    color: this.getDarkerColour(color, 0.8),
                    backgroundColor: color,
                    width: 10,
                    height: 10,
                    patternTransform: 'scale(1)'
                }
            }));
        },
        getPatternPath(index: number): string {
            const patterns = [
                'M 5 0 L 5 10', //vertical lines
                'M 0 5 Q 2.5 0 5 5 T 10 5', // waves
                'M 5 0 L 9 2.5 L 9 7.5 L 5 10 L 1 7.5 L 1 2.5 Z', // hexagons
                'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11', // diagonal lines
                'M 5 0 L 5 10 M 0 5 L 10 5', // cross
                'M 2 2 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0', // dots
                'M 0 0 L 5 10 L 10 0', // zigzag
                'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9', // diagonals
                'M 2 5 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0', // circles
                'M 0 0 L 3 0 L 3 3 L 0 3 Z M 5 5 L 8 5 L 8 8 L 5 8 Z', // checkerboard
                'M 0 5 L 5 0 L 10 5 M 0 5 L 5 10 L 10 5', // diamonds
                'M 5 -5 Q 0 -2.5 5 0 T 5 5 T 5 10 T 5 15' // vertical waves
            ];
            return patterns[index % patterns.length];
        },
        applyPatterns(): void {
            this.chartConfig.series.forEach((series: SeriesData) => {
                if (series.type === 'pie' && series.visible !== false) {
                    const pieColours = this.getPieColours(this.pieBaseColours);
                    series.data = (series.data as any[]).map((point, i) => ({
                        ...point,
                        color: pieColours[i]
                    }));
                }
            });

            this.refreshKey++;
        },
        /** Update highcharts configuration for hybrid chart */
        updateHybridChart(hybridSeries: string[], hybridType: string): void {
            this.setHybridChartType(hybridType);
            this.chartConfig.series.forEach((series, index) => {
                const isHybrid = hybridSeries.includes(series.name[this.activeLang]);
                if (isHybrid) {
                    // TODO: may need to adjust based on what hybrid options become available in the future
                    const baseConfig = {
                        name: series.name,
                        type: isHybrid ? hybridType : this.chartType,
                        color: series.color,
                        dashStyle: 'solid',
                        data: series.data,
                        marker: {
                            symbol: 'circle'
                        }
                    };
                    this.chartConfig.series[index] = baseConfig;
                }
            });
        },
        setSelectedHybridSeries(series: any) {
            this.selectedHybridSeries = series;
        },

        getSelectedHybridSeries() {
            return this.selectedHybridSeries;
        },

        toBilingual(value: string | { en?: string; fr?: string }): LocalizedString {
            if (typeof value === 'string') {
                return { en: value, fr: value };
            }
            return { en: value.en || '', fr: value.fr || '' };
        }
    }
});
