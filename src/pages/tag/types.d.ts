export interface FormData {
    id?: number,
    pid: number,
    name: string,
    description: string
}

export interface Tag {
    id: number,
    pid: number,
    name: string,
    description: string,
    createAt: number,
    updateAt: number
}

export interface TagTreeNode extends Tag {
    // name => title
    title: string,
    // id => value
    value: number,
    // id => key
    key: number,
    selectable: boolean,
    children?: TagTreeNode[]
}