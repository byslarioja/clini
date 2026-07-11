import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Highlightable from './highlightable';

describe('Highlightable', () => {
    it('wraps the matching substring in a <mark>', () => {
        const { container } = render(<Highlightable text="Juan Pérez" toHighlight="Juan" />);
        const marks = container.querySelectorAll('mark');
        expect(marks).toHaveLength(1);
        expect(marks[0].textContent).toBe('Juan');
    });

    it('matches case- and diacritic-insensitively', () => {
        const { container } = render(<Highlightable text="José" toHighlight="jose" />);
        expect(container.querySelector('mark')?.textContent).toBe('José');
    });

    it('renders plain text when there is no match', () => {
        const { container } = render(<Highlightable text="Ana" toHighlight="xyz" />);
        expect(container.querySelector('mark')).toBeNull();
        expect(container.textContent).toBe('Ana');
    });
});
