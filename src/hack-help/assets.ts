export const helpImages = import.meta.glob('./images/*', { eager: true, import: 'default' }) as Record<string, string>;

export { default as helpEnMd } from './help-en.md?raw';
