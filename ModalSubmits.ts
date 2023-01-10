import { globby } from 'globby';
import ModalSubmit from './Interfaces/ModalSubmit';

const files = await globby(`./ModalSubmits/*.ts`);

const modalSubmits = async () => await Promise.all(files
    .map(async (modalSubmitPath) => (await import(modalSubmitPath))?.ModalSubmit));

export const ModalSubmits: ModalSubmit[] = await modalSubmits();