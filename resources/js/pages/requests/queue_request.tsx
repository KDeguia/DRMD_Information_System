import RequestQueueTable from '@/components/request-components/form-queue-request';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    // {
    //     title: 'Queue Request',
    //     href: 'queue_request',
    // },
];

export default function Queue_Request() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Queue Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <RequestQueueTable />
            </div>
        </AppLayout>
    );
}
