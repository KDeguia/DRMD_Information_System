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
import { Head, router, usePage } from '@inertiajs/react';
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <Card className="rounded-lg border p-6 shadow-sm">
                    <div className="item-center flex justify-items-start pb-4">
                        <Button onClick={() => openModal()} variant="default">
                            + New
                        </Button>
                    </div>

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
                            {posts.length ? (
                                posts.map((post) => (
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

                        {/* You can remove this <p> if it's now redundant with the description */}
                        {/* <p>This action cannot be undone.</p> */}

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
