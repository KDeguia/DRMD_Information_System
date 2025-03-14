import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { PostRequest, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts Update',
        href: 'posts_requests',
    },
];

export default function EditRequest({ currentRequest }: { currentRequest: PostRequest }) {
    const [type_of_disaster, setTypeOfDisaster] = useState<string>(currentRequest.type_of_disaster);
    const [purpose, setPurpose] = useState<string>(currentRequest.purpose);
    const [pdf_file, setPDF] = useState<File | null>(null);
    const [pdfPreview, setPDFPreview] = useState<string | null>(null);
    const { errors } = usePage().props;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPDF(file);
            setPDFPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(route('posts_request.update', currentRequest.id), {
            _method: 'put',
            type_of_disaster,
            purpose,
            pdf_file,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Update" />
            <section className="mx-auto max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="type_of_disaster">Type of Disaster</Label>
                            <Input
                                id="type_of_disaster"
                                type="text"
                                value={type_of_disaster}
                                onChange={(e) => setTypeOfDisaster(e.target.value)}
                                placeholder="Select.."
                            />
                            <InputError message={errors.type_of_disaster} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pdf_file">Situational Report</Label>
                            <Input id="pdf_file" type="file" onChange={handleFileChange} />
                            <div className="flex items-center gap-2">
                                {currentRequest.pdf_file ? (
                                    <a href={currentRequest.pdf_file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        View Current PDF
                                    </a>
                                ) : (
                                    <span className="text-gray-500">No current PDF file</span>
                                )}

                                {pdfPreview && (
                                    <a href={pdfPreview} target="_blank" rel="noopener noreferrer" className="text-green-500 underline">
                                        Preview New PDF
                                    </a>
                                )}
                            </div>

                            <InputError message={errors.pdf_file} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="purpose">Purpose</Label>
                            <Textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                            <InputError message={errors.purpose} />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4}>
                            Update
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
