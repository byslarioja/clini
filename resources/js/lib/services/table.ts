import { router } from '@inertiajs/react';

function search(searchTerm: string, indexRoute: string) {
    const query = route().queryParams;
    delete query.filter;

    if (searchTerm) {
        query.filter = searchTerm;
    }

    router.get(route(indexRoute), query, { preserveState: true });
}

function sort(sort_column: string, indexRoute: string) {
    const sort_order = route().queryParams.sort_order === 'desc' ? 'asc' : 'desc';
    const query = route().queryParams;

    router.get(
        route(indexRoute),
        {
            ...query,
            sort_order,
            sort_column,
        },
        { preserveState: true },
    );
}

const table = {
    search,
    sort,
};

export default table;
