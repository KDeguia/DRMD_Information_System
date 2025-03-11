import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CircleCheck } from 'lucide-react';

interface Post {
    id?: number;
    title: string;
    content: string;
    picture?: string;
}

interface Props {
    isOpen: boolean;
    closeModal: () => void;
    post?: Post | null;
}

export default function PostFormModal({ isOpen, closeModal, post }: Props) {
    const [formData, setFormData] = useState<Post>({ title: '', content: '', picture: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                content: post.content,
                picture: post.picture || '',
            });
            setPreview(post.picture || '');
            setSelectedFile(null);
        } else {
            setFormData({ title: '', content: '', picture: '' });
            setPreview('');
            setSelectedFile(null);
        }
    }, [post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        if (selectedFile) {
            data.append('picture', selectedFile);
        }

        const isUpdating = !!post?.id;

        if (isUpdating) {
            data.append('_method', 'PUT');
        }

        const url = isUpdating ? `/posts/${post!.id}` : '/posts';

        router.post(url, data, {
            onSuccess: () => {
                const isUpdating = !!post?.id;

                toast.success(
                    isUpdating ? 'Post updated successfully!' : 'Post created successfully!',
                    isUpdating
                        ? {
                              icon: <CircleCheck className="h-5 w-5 text-blue-500" />,
                              style: {
                                  backgroundColor: '#bfdbfe', // light blue (blue-200)
                                  color: '#1e3a8a', // dark blue (blue-900)
                              },
                          }
                        : undefined,
                );

                closeModal();
                router.reload();
            },
            onError: (errors) => {
                toast.error(errors.message || 'Something went wrong.');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{post ? 'Edit Request' : 'Add New Request'}</DialogTitle>
                    <DialogDescription>{post ? 'Update the post details below.' : 'Fill out the form to create a new post.'}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium">
                            Content
                        </label>
                        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={4} required />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="picture" className="text-sm font-medium">
                            Picture (optional)
                        </label>
                        <Input id="picture" name="picture" type="file" onChange={handleFileChange} accept="image/*" />
                    </div>

                    {preview && (
                        <div className="space-y-2">
                            <p className="text-muted-foreground text-sm">Image Preview:</p>
                            <img src={preview} alt="Preview" className="h-32 w-32 rounded-md border object-cover" />
                        </div>
                    )}

                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit">{post ? 'Update' : 'Create'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
