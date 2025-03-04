import DisasterRequestForm from '@/components/Request/form-request';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Request',
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
            <Head title="Request" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min"> */}
                <DisasterRequestForm />
                {/* </div> */}
            </div>
        </AppLayout>
    );
}
