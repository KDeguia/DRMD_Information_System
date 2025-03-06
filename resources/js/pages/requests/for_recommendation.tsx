import RequestTable from '@/components/request-components/forms-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'For Recommendation',
        href: '/for_recommendation',
    },
];

export default function For_Recommendation() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="For Recommendation" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <RequestTable />
            </div>
        </AppLayout>
    );
}
