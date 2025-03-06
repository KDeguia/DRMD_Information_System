import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'Released',
        href: '/released',
    },
];

export default function Released() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Released" />
            <div>Released</div>
        </AppLayout>
    );
}
