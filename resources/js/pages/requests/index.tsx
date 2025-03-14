import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts Request',
        href: 'posts_request',
    },
];

interface PostRequest {
    id: number;
    type_of_disaster: string;
    purpose: string;
    pdf_file: string;
}

export default function PostRequestIndex({ posts_request }: { posts_request: PostRequest[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Request" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link href={route('posts_request.create')} className="text-indigo-500 underline">
                        Create Post
                    </Link>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        <TableCaption>A list of your recent requests.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Type of Disaster</TableHead>
                                <TableHead>Purpose</TableHead>
                                {/* <TableHead>Situational Report</TableHead> */}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts_request.map((post_request) => (
                                <TableRow key={post_request.id}>
                                    <TableCell className="font-medium">{post_request.id}</TableCell>
                                    <TableCell>{post_request.type_of_disaster}</TableCell>
                                    <TableCell>{post_request.purpose}</TableCell>
                                    {/* <TableCell>
                                        <img
                                            src={post_request.pdf_file}
                                            alt={post_request.type_of_disaster}
                                            className="h-10 rounded-full object-cover"
                                        />
                                    </TableCell> */}
                                    <TableCell className="text-right">
                                        <Link href={route('posts_request.edit', post_request.id)} className="text-indigo-500 hover:text-indigo-600">
                                            Edit
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
