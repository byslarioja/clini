import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
    it('joins class names', () => {
        expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    });

    it('lets the last conflicting tailwind class win', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('drops falsy values and applies conditional classes', () => {
        expect(cn('base', false, null, undefined, { active: true, hidden: false })).toBe('base active');
    });
});
