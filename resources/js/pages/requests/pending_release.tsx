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
        title: 'Pending for Release',
        href: '/pending_release',
    },
];

export default function Pending_Release() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending for Released" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                <RequestTable />
            </div>
        </AppLayout>
    );
}
