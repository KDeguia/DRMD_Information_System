import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'Report',
        href: '/report',
    },
];

export default function Report() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />
            <div>Report</div>
        </AppLayout>
    );
}
