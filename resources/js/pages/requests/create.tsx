import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { addDays, format } from 'date-fns';
import { CalendarIcon, LoaderCircle, Trash } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm as useReactHookForm } from 'react-hook-form';

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
};

type AssistanceItem = {
    type_of_assistance: string;
    particular: string;
    quantity: number;
};

type Province = { province: string };
type Municipality = { municipality: string };

const disasterOptions = ['Armed-Conflict', 'Earthquake', 'Flood', 'Typhoon', 'Fire', 'Landslide', 'Custom'];

export default function CreateRequest() {
    // Inertia form for submission
    const { data, setData, post, processing, errors, reset } = useForm<RequestForm>({
        type_of_disaster: '',
        purpose: '',
        pdf_file: null,
        date_of_request: '',
        province: '',
        city_municipality: '',
        assistance: [],
    });

    // React Hook Form for handling field arrays
    const { control, handleSubmit, setValue, watch, register } = useReactHookForm<RequestForm>({
        defaultValues: {
            assistance: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'assistance',
    });

    const watchAssistance = watch('assistance');

    const [date, setDate] = useState<Date>();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInputError, setCustomInputError] = useState('');
    const customInputRef = useRef<HTMLInputElement>(null);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);

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
                    setSelectedMunicipality(null);
                })
                .catch(console.error);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (showCustomInput && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [showCustomInput]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof RequestForm) => {
        const file = e.target.files?.[0];
        if (file) setData(fieldName, file);
    };

    const handleDisasterChange = (value: string) => {
        if (value === 'Custom') {
            setShowCustomInput(true);
            setData('type_of_disaster', '');
        } else {
            setShowCustomInput(false);
            setCustomInputError('');
            setData('type_of_disaster', value);
        }
    };

    const validate = () => {
        if (showCustomInput && (!data.type_of_disaster || data.type_of_disaster.trim() === '')) {
            setCustomInputError('Please specify the disaster type.');
            return false;
        }
        setCustomInputError('');
        return true;
    };

    const onSubmit = (formData: RequestForm) => {
        if (!validate()) return;

        const finalData = {
            ...data,
            assistance: formData.assistance,
        };

        post(route('posts_request.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Request" />

            <section className="flex h-full flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-950">
                <Card className="mx-auto w-full max-w-3xl p-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="create-request-form">
                        {/* Date Picker */}
                        <div className="grid gap-2">
                            <Label htmlFor="date_of_request">Date of Request</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date_of_request"
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
                                            setData('date_of_request', format(selectedDate, 'MM/dd/yyyy'));
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
                                                if (selected) setData('date_of_request', format(selected, 'MM/dd/yyyy'));
                                            }}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Type of Disaster */}
                        <div className="grid gap-2">
                            <Label htmlFor="type_of_disaster">Type of Disaster</Label>
                            <Select
                                value={showCustomInput ? 'Custom' : data.type_of_disaster}
                                onValueChange={handleDisasterChange}
                                name="type_of_disaster"
                            >
                                <SelectTrigger id="type_of_disaster">
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
                                    <Input
                                        ref={customInputRef}
                                        id="custom_disaster"
                                        name="custom_disaster"
                                        type="text"
                                        placeholder="Enter custom disaster type..."
                                        value={data.type_of_disaster}
                                        onChange={(e) => setData('type_of_disaster', e.target.value)}
                                    />
                                    {customInputError && <p className="mt-1 text-sm text-red-500">{customInputError}</p>}
                                </div>
                            )}

                            <InputError message={errors.type_of_disaster} />
                        </div>

                        {/* Province and Municipality */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="province">Province</Label>
                                <Select
                                    name="province"
                                    onValueChange={(value) => {
                                        setSelectedProvince(value);
                                        setData('province', value);
                                    }}
                                >
                                    <SelectTrigger id="province">
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
                                <Select
                                    name="city_municipality"
                                    disabled={!selectedProvince}
                                    onValueChange={(value) => {
                                        setSelectedMunicipality(value);
                                        setData('city_municipality', value);
                                    }}
                                >
                                    <SelectTrigger id="city_municipality">
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

                        {/* Assistance Section with useFieldArray */}
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
                                                <SelectItem value="food-item">Food Items</SelectItem>
                                                <SelectItem value="non-food-item">Non-Food Items</SelectItem>
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
                                            <Input
                                                type="number"
                                                {...register(`assistance.${index}.quantity`, { valueAsNumber: true })}
                                                defaultValue={field.quantity}
                                            />
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
                                <Textarea id="purpose" name="purpose" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} />
                                <InputError message={errors.purpose} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mode_of_transportation">Mode of Transportation</Label>
                                <Select name="mode_of_transportation">
                                    <SelectTrigger id="mode_of_transportation">
                                        <SelectValue placeholder="Select a mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="air">Pick-Up</SelectItem>
                                        <SelectItem value="land">Delivery</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="pdf_file">Certificate of Depletion of QRF Fund</Label>
                                    <Input id="pdf_file" name="pdf_file" type="file" onChange={(e) => handleFileChange(e, 'pdf_file')} />
                                    <InputError message={errors.pdf_file} />
                                    <Label htmlFor="pdf_filed">Attach Request Letter</Label>
                                    <Input id="pdf_filed" name="pdf_filed" type="file" onChange={(e) => handleFileChange(e, 'pdf_file')} />
                                    <InputError message={errors.pdf_file} />
                                    <Label htmlFor="pdf_filed1">Attach Report of Affected Families</Label>
                                    <Input id="pdf_filed1" name="pdf_filed1" type="file" onChange={(e) => handleFileChange(e, 'pdf_file')} />
                                    <InputError message={errors.pdf_file} />
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Separator orientation="vertical" className="h-full w-[6px]" />
                                <ul className="list-disc space-y-2 pl-4 text-sm">
                                    <li>Files must be in PDF format</li>
                                    <li>Max file size is 5MB</li>
                                    <li>Attach all required documents</li>
                                    <li>Ensure all files are updated</li>
                                </ul>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-4 flex justify-end gap-4">
                            <Button type="button" variant="secondary" onClick={() => reset()}>
                                Clear
                            </Button>
                            <Button type="submit" disabled={processing || (showCustomInput && !data.type_of_disaster.trim())}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
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
