export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export type ContentType = 'TEXT' | 'IMAGE' | 'VIDEO'

export interface PostContent {
    uuid: string;
    id?: number;
    type: ContentType
    text?: string
    imageUrl?: string
    videoUrl?: string
    caption?: string
    references?: any[]
    order?: number
}

export interface PostContentResponse {
    uuid: string;
    id?: number;
    type: ContentType
    text?: string
    mediaUrl?: string
    caption?: string
    references?: any[]
    order?: number
}

export interface Post {
    id?: number;
    title: string;
    categoryIds: number[];
    tagIds: number[];
    contents: PostContent[];
}

export interface PostResponse {
    id: number;
    title: string;
    categories: Category[];
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
    contents: PostContentResponse[];
}

export interface ReferenceDefinition {
    id: number;
    title: string;
    description: string;
    parentId?: number;
}

export interface TextReference {
    term: string;
    startOffset: number;
    endOffset: number;
    existingReferenceId?: number;
    newReference?: {
        title: string;
        description: string;
        parentId?: number;
    };
    _displayTitle?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}