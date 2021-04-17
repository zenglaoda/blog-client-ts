import { Rule } from 'rc-field-form/es/interface';
export { Rule } from 'rc-field-form/es/interface';
export { CreateAPI } from '@/lib/createAjax';

export interface Rules {
    [key:string]: Rule[];
}

export type Key = string | number;
