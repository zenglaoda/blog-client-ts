export interface Link {
    id: number,
    title: string,
    url: string,
    description: string,
    keyword: string,
    tagId: number,
    createAt: number,
    updateAt: number
}

export type FormData = {
    id?: number,
    title: string,
    url: string,
    description: string,
    keyword: string,
    tagId: number, 
};