import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import table from '@/lib/services/table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { FilterX, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

export function Searchbar({ indexRoute }: { indexRoute: string }) {
    const [search, setSearch] = useState('');
    const [debouncedValue] = useDebounceValue(search, 500);

    useEffect(() => {
        if (debouncedValue.length < 3) return;

        table.search(debouncedValue, indexRoute);
    }, [debouncedValue, indexRoute]);

    return (
        <div className="relative flex gap-1">
            <Input id="search" name="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div
                className={cn(
                    buttonVariants({
                        variant: 'ghost',
                        size: 'icon',
                    }),
                    'pointer-events-none absolute right-11',
                )}
            >
                <Search />
            </div>
            <Button variant="outline" size="icon" onClick={() => router.get(route(indexRoute))}>
                <FilterX />
            </Button>
        </div>
    );
}
