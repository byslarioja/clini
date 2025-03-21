import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginatedLink {
    url: string;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    [k: string]: {
        data: T[];
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: PaginatedLink[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
        links: {
            first_page_url: string;
            last_page_url: string;
            next_page_url: string | null;
            prev_page_url: string | null;
        };
    };
}
