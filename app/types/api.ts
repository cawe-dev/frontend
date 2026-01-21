export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
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