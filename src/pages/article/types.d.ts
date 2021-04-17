import { Tag } from '@/pages/tag/types';

export interface Article {
    id: number,
    title: string,
    tagId: number,
    status: string,
    content: string,
    keyword: string,
    description: string,
    createdAt: number,
    updatedAt: number,
    tag: Tag
}