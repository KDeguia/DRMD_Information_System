import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Ellipsis, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { PageProps as InertiaPageProps } from '@inertiajs/core'; // ✅ Add this!

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts Request',
        href: 'posts_request',
    },
];

interface PostRequest {
    id: number;
    date_of_request: string;
    type_of_disaster: string;
    purpose: string;
    pdf_file: string;
}

interface FlashMessages {
    updated?: string;
    deleted?: string;
    created?: string;
    error?: string;
}

interface PageProps extends InertiaPageProps {
    // ✅ Extend Inertia’s PageProps
    flash: FlashMessages;
}

export default function PostRequestIndex({ posts_request }: { posts_request: PostRequest[] }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (!deleteId) return;

        router.delete(route('posts_request.destroy', deleteId), {
            onError: () => {
                toast.error('Failed to delete post request.');
            },
        });
    };

    const { props } = usePage<PageProps>();

    useEffect(() => {
        if (props.flash?.created) {
            Swal.fire({
                title: 'Success!',
                text: props.flash.created,
                icon: 'success',
                confirmButtonText: 'Ok',
                background: '#a9a9a9',
                color: '#000000',
                confirmButtonColor: '#000000',
                timer: 2000,
                timerProgressBar: true,
                customClass: {
                    popup: 'custom-swal-popup',
                    icon: 'custom-icon-color',
                },
            });
        }

        if (props.flash?.updated) {
            toast.success(props.flash.updated);
        }

        if (props.flash?.deleted) {
            toast.success(props.flash.deleted);
        }

        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Request" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <Link href={route('posts_request.create')}>
                        <Button>
                            <Plus className="h-4 w-4" />
                            Create Post
                        </Button>
                    </Link>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <Table>
                        <TableCaption>A list of your recent requests.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Date of Request</TableHead>
                                <TableHead>Type of Disaster</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Situational Report</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {posts_request.map((post_request) => (
                                <TableRow key={post_request.id}>
                                    <TableCell className="font-medium">{post_request.id}</TableCell>
                                    <TableCell>{post_request.date_of_request}</TableCell>
                                    <TableCell>{post_request.type_of_disaster}</TableCell>
                                    <TableCell>{post_request.purpose}</TableCell>

                                    <TableCell>
                                        {post_request.pdf_file ? (
                                            <a
                                                href={post_request.pdf_file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-500 hover:underline"
                                            >
                                                <FileText className="h-5 w-5" />
                                                View PDF
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">No file</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="flex justify-end gap-2 text-right">
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button className="outline">
                                                    <Ellipsis />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Link
                                                    href={route('posts_request.edit', post_request.id)}
                                                    className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="inline-flex items-center gap-1 text-red-500 hover:text-red-600"
                                                            onClick={() => setDeleteId(post_request.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete Post Request</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete this post request? This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        <DialogFooter className="gap-2 sm:justify-end">
                                                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                                                                Cancel
                                                            </Button>

                                                            <Button variant="destructive" onClick={handleDelete}>
                                                                Confirm Delete
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </PopoverContent>
                                        </Popover>
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
