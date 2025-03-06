import DisasterRequestForm from '@/components/request-components/form-request';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'New Request',
        href: '/new_request',
    },
];

export default function New_Request() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Requests" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <DisasterRequestForm />
            </div>
        </AppLayout>
    );
}
