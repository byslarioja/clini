import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMemo } from 'react';

interface SearchSelectorProps<T> {
    label: string;
    placeholder?: string;
    data: T[];
    search: string;
    onSearch: (value: string) => void;
    selectedId: string;
    onSelect: (item: T) => void;
    displayField: keyof T;
    highlight?: boolean;
    extractId: (item: T) => string;
    extractExtraAction?: (item: T) => void;
}

function highlightField(text: string, search: string): string {
    if (!search) return text;
    return text.replace(new RegExp(search, 'gi'), (match) => `<mark class='bg-yellow-300'>${match}</mark>`);
}

export function SearchSelector<T extends Record<string, any>>({
    label,
    placeholder = 'Buscar...',
    data,
    search,
    onSearch,
    selectedId,
    onSelect,
    displayField,
    extractId,
    extractExtraAction,
}: SearchSelectorProps<T>) {
    const filtered = useMemo(() => {
        return data.filter((item) => String(item[displayField]).toLowerCase().includes(search.toLowerCase()));
    }, [data, search, displayField]);

    return (
        <div className="mb-6">
            <label className="mb-2 block font-semibold">{label}</label>
            <Input placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} />
            <div className="mt-2 max-h-48 overflow-auto rounded border p-2">
                {filtered.map((item) => {
                    const id = extractId(item);
                    const isSelected = selectedId === id;
                    const display = String(item[displayField]);

                    return (
                        <Button
                            key={id}
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => {
                                onSelect(item);
                                extractExtraAction?.(item);
                            }}
                            className="w-full justify-start"
                        >
                            <span dangerouslySetInnerHTML={{ __html: highlightField(display, search) }} />
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
