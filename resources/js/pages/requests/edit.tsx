import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { FormEventHandler, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { PostRequest, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Posts Update', href: 'posts_requests' }];

export default function EditRequest({ currentRequest }: { currentRequest: PostRequest }) {
    const { errors } = usePage().props;

    const [type_of_disaster, setTypeOfDisaster] = useState(currentRequest.type_of_disaster);
    const [purpose, setPurpose] = useState(currentRequest.purpose);
    const [pdf_file, setPDF] = useState<File | null>(null);
    const [pdfPreview, setPDFPreview] = useState<string | null>(null);

    // No need to preload date_of_request
    const [date, setDate] = useState<Date | undefined>(undefined);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPDF(file);
            setPDFPreview(URL.createObjectURL(file));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Build the form data
        const formData = {
            _method: 'put',
            type_of_disaster,
            purpose,
            date_of_request: date ? format(date, 'yyyy-MM-dd') : null, // send null if no date selected
            pdf_file,
        };

        router.post(route('posts_request.update', currentRequest.id), formData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts Update" />
            <section className="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-6 dark:bg-gray-950">
                <Card className="mx-auto w-full max-w-3xl p-6">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            {/* Date Picker (only saves new date) */}
                            <div className="grid gap-2">
                                <Label>Date of Request</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
                                        {/* Quick Select */}
                                        <Select
                                            onValueChange={(value) => {
                                                const selectedDate = addDays(new Date(), parseInt(value));
                                                setDate(selectedDate);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Quick Select" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="0">Today</SelectItem>
                                                <SelectItem value="1">Tomorrow</SelectItem>
                                                <SelectItem value="3">In 3 days</SelectItem>
                                                <SelectItem value="7">In a week</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* Calendar */}
                                        <div className="rounded-md border">
                                            <Calendar mode="single" selected={date} onSelect={(selectedDate) => setDate(selectedDate ?? undefined)} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <InputError message={errors.date_of_request} />
                            </div>

                            {/* Type of Disaster */}
                            <div className="grid gap-2">
                                <Label htmlFor="type_of_disaster">Type of Disaster</Label>
                                <Input
                                    id="type_of_disaster"
                                    type="text"
                                    value={type_of_disaster}
                                    onChange={(e) => setTypeOfDisaster(e.target.value)}
                                />
                                <InputError message={errors.type_of_disaster} />
                            </div>

                            {/* PDF Upload */}
                            <div className="grid gap-2">
                                <Label htmlFor="pdf_file">Situational Report</Label>
                                <Input id="pdf_file" type="file" onChange={handleFileChange} />
                                <div className="flex items-center gap-2">
                                    {currentRequest.pdf_file ? (
                                        <a
                                            href={currentRequest.pdf_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
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

                            {/* Purpose */}
                            <div className="grid gap-2">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                                <InputError message={errors.purpose} />
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="mt-4 w-full">
                                Update
                            </Button>
                        </div>
                    </form>
                </Card>
            </section>
        </AppLayout>
    );
}
