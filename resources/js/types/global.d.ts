import type { Page } from '@inertiajs/core';
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

declare module '@inertiajs/react' {
    export declare function usePage<T>(): Page<T & { message?: { content: string; type: 'error' | 'info' | 'success' } }>;
}
