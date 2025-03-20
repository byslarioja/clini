import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { FilterX, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

function onSearch(searchTerm: string, indexRoute: string) {
    const query = route().queryParams;
    delete query.search;

    if (searchTerm) {
        query.search = searchTerm;
    }

    router.get(route(indexRoute), query, { preserveState: true });
}

export function Searchbar({ indexRoute }: { indexRoute: string }) {
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (search.length < 3) return;

        onSearch(search, indexRoute);
    }, [search, indexRoute]);

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
