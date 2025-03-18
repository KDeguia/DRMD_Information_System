import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Ellipsis, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // 👈 add Input
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { PageProps as InertiaPageProps } from '@inertiajs/core';

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
    province: string;
    city_municipality: string;
}

interface FlashMessages {
    updated?: string;
    deleted?: string;
    created?: string;
    error?: string;
}

interface PageProps extends InertiaPageProps {
    flash: FlashMessages;
}

export default function PostRequestIndex({ posts_request }: { posts_request: PostRequest[] }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // ✅ Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    // ✅ Search State
    const [searchQuery, setSearchQuery] = useState('');

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

    // ✅ Filter posts based on search query
    const filteredPosts = posts_request.filter((post) => {
        const query = searchQuery.toLowerCase();

        return (
            (post.city_municipality ?? '').toLowerCase().includes(query) ||
            (post.province ?? '').toLowerCase().includes(query) ||
            (post.type_of_disaster ?? '').toLowerCase().includes(query) ||
            (post.purpose ?? '').toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredPosts.length / entriesPerPage);

    // ✅ Paginated data from filteredPosts
    const paginatedPosts = filteredPosts.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    // ✅ Showing X to Y of Z entries
    const startIndex = filteredPosts.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
    const endIndex = Math.min(currentPage * entriesPerPage, filteredPosts.length);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Request" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={route('posts_request.create')}>
                        <Button>
                            <Plus className="h-4 w-4" />
                            Create Post
                        </Button>
                    </Link>

                    <div className="flex w-full flex-wrap items-center justify-between gap-4 sm:w-auto">
                        {/* ✅ Search Input */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // reset page to 1 when searching
                                }}
                                className="pl-10"
                            />
                        </div>

                        {/* ✅ Entries Per Page Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
                            <Select
                                value={entriesPerPage.toString()}
                                onValueChange={(value) => {
                                    setEntriesPerPage(parseInt(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 25, 50].map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-gray-700 dark:text-gray-300">entries</span>
                        </div>
                    </div>
                </div>

                {/* ✅ Table */}
                <Card className="overflow-x-auto rounded-lg border p-4 shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date of Request</TableHead>
                                <TableHead>Requested by</TableHead>
                                <TableHead>Type of Disaster</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Situational Report</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedPosts.length > 0 ? (
                                paginatedPosts.map((post_request) => (
                                    <TableRow key={post_request.id}>
                                        <TableCell>{post_request.date_of_request}</TableCell>
                                        <TableCell>
                                            {post_request.city_municipality}, {post_request.province}
                                        </TableCell>
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
                                                <PopoverTrigger asChild>
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

                                                    <Dialog open={deleteId === post_request.id} onOpenChange={(open) => !open && setDeleteId(null)}>
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No posts request found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* ✅ Pagination Controls */}
                    {filteredPosts.length > 0 && (
                        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <div className="text-sm text-gray-500">
                                Showing {startIndex} to {endIndex} of {filteredPosts.length} entries
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                                    Previous
                                </Button>

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <Button key={page} variant={page === currentPage ? 'default' : 'outline'} onClick={() => setCurrentPage(page)}>
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
