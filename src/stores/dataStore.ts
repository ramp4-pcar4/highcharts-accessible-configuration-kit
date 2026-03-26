import { defineStore } from 'pinia';
import { HighchartsConfig } from '@/definitions';
import type { LangId, LocalizedString } from '@/definitions';

export const useDataStore = defineStore('chartData', {
    state: () => ({
        headers: [] as LocalizedString[],
        gridData: [] as string[][],
        uploaded: false,
        datatableView: false,
        uploadedFileLang: 'en' as LangId
    }),
    actions: {
        /** Set the uploaded file language */
        setUploadedFileLang(lang: LangId) {
            this.uploadedFileLang = lang;
        },

        /** Reset store to initial state */
        resetStore(): void {
            this.headers = [];
            this.gridData = [];
            this.uploaded = false;
            this.datatableView = false;
        },

        /** Initially set column headers */
        setHeaders(headers: LocalizedString[]): void {
            this.headers = headers;
        },

        /** Initially set grid data when uploaded new file */
        setGridData(data: string[][]): void {
            this.gridData = data;
        },

        /** Set if data section should show datatable */
        setDatatableView(datatableView: boolean): void {
            this.datatableView = datatableView;
        },

        /** Set flag if user has uploaded valid chart data format */
        toggleUploaded(uploaded: boolean): void {
            this.uploaded = uploaded;
        },

        // extract grid data from highcharts config file
        extractGridData(config: HighchartsConfig): void {
            if (config.series && Array.isArray(config.series)) {
                const headers: LocalizedString[] = config.series.map((series) => series.name);
                this.setHeaders(headers);

                const gridData: string[][] = [];
                config.series.forEach((series, colIdx) => {
                    series.data?.forEach((value, rowIdx) => {
                        if (!gridData[rowIdx]) {
                            gridData[rowIdx] = [];
                        }
                        gridData[rowIdx][colIdx] = value.toString();
                    });
                });

                // check for categories and add them as first column if present
                // TODO: handle cases where categories is missing (fill with default values?)
                if (config.xAxis && config.xAxis.categories) {
                    const categories = config.xAxis.categories;
                    // insert categories as first column
                    gridData.forEach((row, idx) => {
                        row.unshift(categories[idx] as string);
                    });
                    // add category header
                    this.headers.unshift(config.xAxis.title?.text || { en: '', fr: '' });
                }

                this.setGridData(gridData);
            } else {
                console.error('Invalid highcharts config file structure uploaded');
            }
        },

        /** Update cell value in grid data */
        updateCell(row: number, col: number, value: string, lang: LangId): void {
            if (this.gridData[row]) {
                if (col === 0) {
                    this.gridData[row][col][lang] = value;
                } else {
                    this.gridData[row][col] = value;
                }
            }
        },

        /** Delete row(s) from grid data */
        deleteRows(selectedRowIdxs: string[]): void {
            this.gridData = this.gridData.filter((_, idx) => !selectedRowIdxs.includes(idx.toString()));
        },

        /** Add new row to grid data */
        addNewRow(selectedRowIdx: string, below: boolean = true): void {
            const newRow = this.headers.map((_, colIdx) => (colIdx === 0 ? '' : '0'));
            const newIdx = parseInt(selectedRowIdx);
            // add empty row based on insert above/below
            if (below) {
                this.gridData.splice(newIdx + 1, 0, newRow);
            } else {
                this.gridData.splice(newIdx, 0, newRow);
            }
        },

        /** Delete column(s) from grid data */
        deleteCols(selectedColIdxs: string[]): void {
            // sort indices in descending to avoid issues with shifting
            const selectedIdxs = selectedColIdxs
                .map((idx: string) => parseInt(idx))
                .sort()
                .reverse();

            // for each col delete its header and all col values from grid
            selectedIdxs.forEach((idx) => {
                this.headers.splice(idx, 1);
            });
            this.gridData.forEach((row) => {
                selectedIdxs.forEach((idx) => {
                    row.splice(idx, 1);
                });
            });
        },

        /** Add new column to grid data */
        addNewCol(selectedColIdx: string, right: boolean = true): void {
            const newCol = { en: 'Untitled', fr: 'Sans titre' };
            // determine new position based on insert right/left
            const newIdx = right ? parseInt(selectedColIdx) + 1 : parseInt(selectedColIdx);
            // add new header and empty col of values
            this.headers.splice(newIdx, 0, newCol);
            this.gridData.forEach((row) => {
                row.splice(newIdx, 0, '0');
            });
        }
    }
});
