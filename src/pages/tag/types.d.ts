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
    createdAt: number,
    updatedAt: number
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

export interface TagNode extends TagTreeNode {
    children?: TagNode[],
    links: number,
    articles: number,
    parentTag: TagNode
}