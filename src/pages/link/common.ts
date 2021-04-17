import { useState } from "react";
import { Rules } from '@/types';

export const rules: Rules = {
    title: [
        { required: true },
        { whitespace: true },
        { type: 'string', max: 60, min: 2 }
    ],
    url: [
        { required: true },
        { whitespace: true },
        { type: 'url', max: 100, min: 2 }
    ],
    tagIds: [
        { required: true },
        { type: 'array' }
    ],
    description: [
        { type: 'string', max: 200 },
        { whitespace: true }
    ],
    keyword: [
        { type: 'string', max: 200, required: true },
        { whitespace: true }
    ],
    tagId: [
        { required: true }
    ]
};

export function useGetInitialValues() {
    return useState({
        title: '',
        url: '',
        tagIds: [],
        keyword: '',
        description: ''
    });
}
