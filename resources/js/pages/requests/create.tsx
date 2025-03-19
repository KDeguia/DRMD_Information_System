import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { addDays, format } from 'date-fns';
import { CalendarIcon, LoaderCircle, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import Swal from 'sweetalert2';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Requests', href: '#' },
    { title: 'New Request', href: '/posts_requests/create' },
];

type RequestForm = {
    type_of_disaster: string;
    purpose: string;
    pdf_file: File | null;
    date_of_request?: string;
    province: string;
    city_municipality: string;
    assistance: AssistanceItem[];
    mode_of_transportation: string;
};

type AssistanceItem = {
    type_of_assistance: string;
    particular: string;
    quantity: number;
};

type Province = { province: string };
type Municipality = { municipality: string };

const disasterOptions = ['Armed-Conflict', 'Earthquake', 'Flood', 'Typhoon', 'Fire', 'Landslide', 'Custom'];
const assistanceTypes = [
    { label: 'Food Items', value: 'food-item' },
    { label: 'Non-Food Items', value: 'non-food-item' },
];

export default function CreateRequest() {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequestForm>({
        defaultValues: {
            type_of_disaster: '',
            purpose: '',
            pdf_file: null,
            date_of_request: '',
            province: '',
            city_municipality: '',
            mode_of_transportation: '',
            assistance: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'assistance',
    });

    const watchAssistance = watch('assistance');
    const watchDisaster = watch('type_of_disaster');

    const [date, setDate] = useState<Date>();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInputError, setCustomInputError] = useState('');
    const customInputRef = useRef<HTMLInputElement>(null);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        axios
            .get('/provinces')
            .then((res) => setProvinces(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(`/municipalities/${selectedProvince}`)
                .then((res) => {
                    setMunicipalities(res.data);
                })
                .catch(console.error);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (showCustomInput && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [showCustomInput]);

    const handleDisasterChange = (value: string) => {
        if (value === 'Custom') {
            setShowCustomInput(true);
            setValue('type_of_disaster', '');
        } else {
            setShowCustomInput(false);
            setCustomInputError('');
            setValue('type_of_disaster', value);
        }
    };

    const validateCustomDisaster = (): boolean => {
        if (showCustomInput && (!watchDisaster || watchDisaster.trim() === '')) {
            setCustomInputError('Please specify the disaster type.');
            return false;
        }
        setCustomInputError('');
        return true;
    };

    const onSubmit = async (formData: RequestForm) => {
        if (!validateCustomDisaster()) return;

        const payload = {
            ...formData,
        };

        const formPayload = new FormData();

        // Loop over each key in payload except assistance.
        for (const key in payload) {
            if (key !== 'assistance') {
                formPayload.append(key, (payload[key as keyof RequestForm] ?? '').toString());
            }
        }

        // Append assistance items properly.
        if (Array.isArray(payload.assistance)) {
            payload.assistance.forEach((item, index) => {
                formPayload.append(`assistance[${index}][type_of_assistance]`, item.type_of_assistance);
                formPayload.append(`assistance[${index}][particular]`, item.particular);
                formPayload.append(`assistance[${index}][quantity]`, item.quantity.toString());
            });
        }

        if (payload.assistance.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please add at least one assistance item.',
            });
            return;
        }

        // Append the file with its filename.
        if (payload.pdf_file) {
            formPayload.append('pdf_file', payload.pdf_file, payload.pdf_file.name);
        }

        try {
            await axios.post('/posts_request', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            reset();

            Swal.fire({
                title: 'Successful!',
                text: 'Request created!',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                router.visit('/posts_request');
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Make sure all the inputs are correct and complete!',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Request" />

            <section className="flex h-full flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-950">
                <Card className="mx-auto w-full max-w-3xl p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" disabled={isSubmitting}>
                        {/* Date Picker */}
                        <div className="grid gap-2">
                            <Label htmlFor="date_of_request">Date of Request</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
                                    <Select
                                        onValueChange={(value) => {
                                            const selectedDate = addDays(new Date(), parseInt(value));
                                            setDate(selectedDate);
                                            setValue('date_of_request', format(selectedDate, 'yyyy-MM-dd'));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Today</SelectItem>
                                            <SelectItem value="1">Tomorrow</SelectItem>
                                            <SelectItem value="3">In 3 days</SelectItem>
                                            <SelectItem value="7">In a week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="rounded-md border">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(selected) => {
                                                setDate(selected);
                                                if (selected) setValue('date_of_request', format(selected, 'MM/dd/yyyy'));
                                            }}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Type of Disaster */}
                        <div className="grid gap-2">
                            <Label htmlFor="type_of_disaster">Type of Disaster</Label>
                            <Select value={showCustomInput ? 'Custom' : watchDisaster} onValueChange={handleDisasterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a disaster type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {disasterOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {showCustomInput && (
                                <div className="mt-2">
                                    <Label htmlFor="custom_disaster">Specify Disaster Type</Label>
                                    <Input ref={customInputRef} {...register('type_of_disaster')} placeholder="Enter custom disaster type..." />
                                    {customInputError && <p className="mt-1 text-sm text-red-500">{customInputError}</p>}
                                </div>
                            )}
                        </div>

                        {/* Province and Municipality */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="province">Province</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedProvince(value);
                                        setValue('province', value);
                                        setValue('city_municipality', ''); // ✅ Reset municipality when province changes
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Provinces</SelectLabel>
                                            {provinces.map((prov, idx) => (
                                                <SelectItem key={idx} value={prov.province}>
                                                    {prov.province}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city_municipality">Municipality</Label>
                                <Select disabled={!selectedProvince} onValueChange={(value) => setValue('city_municipality', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedProvince ? 'Select a municipality' : 'Select province first'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Municipalities</SelectLabel>
                                            {municipalities.map((mun, idx) => (
                                                <SelectItem key={idx} value={mun.municipality}>
                                                    {mun.municipality}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Assistance */}
                        <div className="grid gap-4">
                            <div className="flex items-center justify-between">
                                <Label>Assistance Requested</Label>
                                <Button type="button" onClick={() => append({ type_of_assistance: '', particular: '', quantity: 1 })}>
                                    + Add Assistance
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-3 items-end gap-2">
                                    <div className="grid gap-2">
                                        <Label>Type of Assistance</Label>
                                        <Select
                                            value={watchAssistance?.[index]?.type_of_assistance || ''}
                                            onValueChange={(value) => setValue(`assistance.${index}.type_of_assistance`, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select assistance" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {assistanceTypes.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Particular</Label>
                                        <Select
                                            value={watchAssistance?.[index]?.particular || ''}
                                            onValueChange={(value) => setValue(`assistance.${index}.particular`, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select particular" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="family-food-pack">Family Food Pack</SelectItem>
                                                <SelectItem value="hygiene-kit">Hygiene Kit</SelectItem>
                                                <SelectItem value="sleeping-kit">Sleeping Kit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end space-x-2">
                                        <div className="grid w-full gap-2">
                                            <Label>Quantity</Label>
                                            <Input type="number" {...register(`assistance.${index}.quantity`, { valueAsNumber: true })} />
                                        </div>
                                        <Button variant="destructive" type="button" onClick={() => remove(index)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Purpose */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea {...register('purpose')} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mode_of_transportation">Mode of Transportation</Label>
                                <Select onValueChange={(value) => setValue('mode_of_transportation' as keyof RequestForm, value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="air">Pick-Up</SelectItem>
                                        <SelectItem value="land">Delivery</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <div className="grid gap-4">
                                <Label htmlFor="pdf_file">Certificate of Depletion of QRF Fund</Label>
                                <Input
                                    aria-label="Certificate of Depletion PDF Upload"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null;

                                        if (file && file.size > 5 * 1024 * 1024) {
                                            toast({
                                                variant: 'destructive',
                                                title: 'File too large',
                                                description: 'Maximum allowed file size is 5MB.',
                                            });
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                            setValue('pdf_file', null);
                                            return;
                                        }

                                        setValue('pdf_file', file);
                                    }}
                                />
                            </div>
                            <div className="flex items-start gap-4">
                                <Separator orientation="vertical" className="h-full w-[6px]" />
                                <ul className="list-disc space-y-2 pl-4 text-sm">
                                    <li>Files must be in PDF format</li>
                                    <li>Max file size is 5MB</li>
                                    <li>Attach all required documents</li>
                                </ul>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-4 flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    reset();
                                    setShowCustomInput(false);
                                    setCustomInputError('');
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                            >
                                Clear
                            </Button>
                            <Button type="submit" disabled={isSubmitting || (showCustomInput && !watchDisaster?.trim())}>
                                {isSubmitting ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </section>
        </AppLayout>
    );
}
