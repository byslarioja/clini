import { router } from '@inertiajs/react';

function _getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params;
}

function search(searchTerm: string, indexRoute: string) {
    const query = _getQueryParams();
    query.delete('filter');

    if (searchTerm.length) {
        query.set('filter', searchTerm);
    }

    router.get(route(indexRoute), Object.fromEntries(query.entries()), { preserveState: true });
}

function sort(sort_column: string, indexRoute: string) {
    const query = _getQueryParams();
    const currentSortOrder = query.get('sort_order') || 'desc';
    const sort_order = currentSortOrder === 'desc' ? 'asc' : 'desc';

    query.set('sort_order', sort_order);
    query.set('sort_column', sort_column);

    router.get(route(indexRoute), Object.fromEntries(query.entries()), { preserveState: true });
}

const table = {
    search,
    sort,
};

export default table;
