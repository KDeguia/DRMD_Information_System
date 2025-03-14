import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts Create',
        href: 'posts_requests/create',
    },
];

type RequestForm = {
    type_of_disaster: string;
    purpose: string;
    pdf_file: File | null;
};

export default function CreateRequest() {
    const { data, setData, post, processing, errors } = useForm<RequestForm>({
        type_of_disaster: '',
        purpose: '',
        pdf_file: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('pdf_file', file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('posts_request.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Create" />
            <section className="mx-auto max-w-md rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="type_of_disaster">Type of Disaster</Label>
                            <Input
                                id="type_of_disaster"
                                type="type_of_disaster"
                                value={data.type_of_disaster}
                                onChange={(e) => setData('type_of_disaster', e.target.value)}
                                placeholder="Select.."
                            />
                            <InputError message={errors.type_of_disaster} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pdf_file">Situational Report</Label>
                            <Input id="pdf_file" type="file" onChange={handleFileChange} />
                            <InputError message={errors.pdf_file} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="purpose">Purpose</Label>
                            <Textarea id="purpose" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} />
                            <InputError message={errors.purpose} />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
