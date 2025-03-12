import PostNewRequest from '@/components/request-components/form-request';
import { Card } from '@/components/ui/card';
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
        href: 'new_request',
    },
];

export default function New_Request() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Request" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <Card className="mx-auto w-full max-w-3xl p-6">
                    <PostNewRequest />
                </Card>
            </div>
        </AppLayout>
    );
}
