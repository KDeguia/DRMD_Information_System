import PostFormModal from '@/components/PostFormModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'Queue Request',
        href: 'queue_request',
    },
];

export default function Posts() {
    const { posts } = usePage<{
        posts: { id: number; title: string; content: string; picture?: string }[];
    }>().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const openModal = (post = null) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        setPostToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!postToDelete) return;

        setIsDeleting(true);

        router.delete(`/posts/${postToDelete}`, {
            onSuccess: () => {
                toast.success('Request deleted successfully!');
                setDeleteDialogOpen(false);
                setPostToDelete(null);
                router.reload();
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to delete Request.');
                setDeleteDialogOpen(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    // Filter posts based on search
    const filteredPosts = posts.filter((post) => {
        const query = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query);
    });

    const totalPages = Math.ceil(filteredPosts.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <Card className="rounded-lg border p-6 shadow-sm">
                    {/* Top bar: New button, Entries dropdown, Search */}
                    <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="default">
                                <Link href="/new_request">+ New</Link>
                            </Button>
                            <select
                                value={entriesPerPage}
                                onChange={handleEntriesChange}
                                className="border-input bg-background ring-offset-background focus-visible:ring-ring ml-4 rounded-md border px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                {[5, 10, 20, 30, 50, 100].map((number) => (
                                    <option key={number} value={number}>
                                        Entries {number}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search box */}
                        <div className="w-full md:max-w-xs">
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Picture</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead>Request No.</TableHead>
                                <TableHead>Date of Request</TableHead>
                                <TableHead>Requested By</TableHead>
                                <TableHead>Type of Disaster</TableHead>
                                <TableHead>Particular</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Validated?</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedPosts.length ? (
                                paginatedPosts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            {post.picture ? (
                                                <img src={post.picture} alt="Post" className="h-16 w-16 rounded-full object-cover" />
                                            ) : (
                                                'No Picture'
                                            )}
                                        </TableCell>
                                        <TableCell>{post.title}</TableCell>
                                        <TableCell>{post.content}</TableCell>
                                        {/* Fill in additional columns here as needed */}
                                        <TableCell colSpan={10}></TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button onClick={() => openModal(post)} variant="secondary" size="sm">
                                                    Edit
                                                </Button>
                                                <Button onClick={() => confirmDelete(post.id)} variant="destructive" size="sm">
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={13} className="text-center text-gray-500">
                                        No request found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                                Previous
                            </Button>

                            <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                <Button
                                    variant={currentPage === 1 ? 'default' : 'outline'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setCurrentPage(1)}
                                >
                                    1
                                </Button>

                                {currentPage > 4 && <span className="text-muted-foreground px-1">...</span>}

                                {(() => {
                                    const pageButtons = [];
                                    const startPage = currentPage >= totalPages - 2 ? totalPages - 2 : Math.max(2, currentPage - 1);
                                    const endPage = Math.min(totalPages - 1, startPage + 2);

                                    for (let i = startPage; i <= endPage; i++) {
                                        if (i > 1 && i < totalPages) {
                                            pageButtons.push(
                                                <Button
                                                    key={i}
                                                    variant={currentPage === i ? 'default' : 'outline'}
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setCurrentPage(i)}
                                                >
                                                    {i}
                                                </Button>,
                                            );
                                        }
                                    }

                                    return pageButtons;
                                })()}

                                {currentPage < totalPages - 3 && <span className="text-muted-foreground px-1">...</span>}

                                {totalPages > 1 && (
                                    <Button
                                        variant={currentPage === totalPages ? 'default' : 'outline'}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setCurrentPage(totalPages)}
                                    >
                                        {totalPages}
                                    </Button>
                                )}
                            </div>

                            <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                                Next
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Post Form Modal */}
                <PostFormModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} post={selectedPost} />

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this request?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the request and remove its data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting} onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                                {isDeleting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deleting...
                                    </div>
                                ) : (
                                    'Delete'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
