import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'On Process',
        href: '/on_process',
    },
];

export default function On_Process() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="On Process" />
            <div>On Process</div>
        </AppLayout>
    );
}
