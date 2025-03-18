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
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import { addDays, format } from 'date-fns';
import { CalendarIcon, Trash } from 'lucide-react';
import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Requests',
        href: '#',
    },
    {
        title: 'New Request',
        href: '/posts_requests/create',
    },
];

type RequestForm = {
    type_of_disaster: string;
    purpose: string;
    pdf_file: File | null;
    date_of_request?: string | Date;
    province: string;
    city_municipality: string;
};

type Province = {
    province: string;
};

type Municipality = {
    municipality: string;
};

const disasterOptions = ['Armed-Conflict', 'Earthquake', 'Flood', 'Typhoon', 'Fire', 'Landslide', 'Custom'];

export default function CreateRequest() {
    const { data, setData, post, processing, errors } = useForm<RequestForm>({
        type_of_disaster: '',
        purpose: '',
        pdf_file: null,
        date_of_request: '',
        province: '',
        city_municipality: '',
    });

    const [date, setDate] = React.useState<Date>();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInputError, setCustomInputError] = useState('');
    const customInputRef = useRef<HTMLInputElement>(null);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
    const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);

    // Load provinces on mount
    useEffect(() => {
        axios
            .get('/provinces')
            .then((res) => {
                setProvinces(res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    // Load municipalities when province is selected
    useEffect(() => {
        if (selectedProvince) {
            axios
                .get(`/municipalities/${selectedProvince}`)
                .then((res) => {
                    setMunicipalities(res.data);
                    setBarangays([]); // Reset barangays
                    setSelectedMunicipality(null);
                })
                .catch((err) => console.error(err));
        }
    }, [selectedProvince]);

    // Load barangays when municipality is selected
    // useEffect(() => {
    //     if (selectedProvince && selectedMunicipality) {
    //         axios
    //             .get(`/barangays/${selectedProvince}/${selectedMunicipality}`)
    //             .then((res) => {
    //                 setBarangays(res.data);
    //                 setSelectedBarangay(null);
    //             })
    //             .catch((err) => console.error(err));
    //     }
    // }, [selectedMunicipality, selectedProvince]);

    useEffect(() => {
        if (showCustomInput && customInputRef.current) {
            customInputRef.current.focus();
        }
    }, [showCustomInput]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('pdf_file', file);
        }
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!validate()) return;

        post(route('posts_request.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Create" />
            <section className="flex h-full flex-1 flex-col gap-2 rounded-xl bg-gray-100 p-4 dark:bg-gray-950">
                <Card className="mx-auto w-full max-w-3xl p-4">
                    <form className="space-y-4" onSubmit={submit}>
                        {/* DATE PICKER */}
                        <div className="grid-cols grid gap-2">
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
                                        <SelectContent position="popper">
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
                                                if (selected) {
                                                    setData('date_of_request', format(selected, 'MM/dd/yyyy'));
                                                }
                                            }}
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* TYPE OF DISASTER */}
                        <div className="grid-cols grid gap-2">
                            <Label htmlFor="type_of_disaster">Type of Disaster</Label>

                            {/* Disaster Select */}
                            <Select value={showCustomInput ? 'Custom' : data.type_of_disaster} onValueChange={handleDisasterChange}>
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

                            {/* Custom Disaster Input */}
                            {showCustomInput && (
                                <div className="mt-2">
                                    <Input
                                        ref={customInputRef}
                                        type="text"
                                        placeholder="Enter custom disaster type..."
                                        value={data.type_of_disaster}
                                        onChange={(e) => setData('type_of_disaster', e.target.value)}
                                    />
                                    {customInputError && <p className="mt-1 text-sm text-red-500">{customInputError}</p>}
                                </div>
                            )}

                            {/* Server-side validation error */}
                            <InputError message={errors.type_of_disaster} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Province */}
                            <div className="grid gap-2">
                                <Label htmlFor="province">Province</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setSelectedProvince(value);
                                        setData('province', value);
                                        setSelectedMunicipality(null);
                                        setSelectedBarangay(null);
                                    }}
                                >
                                    <SelectTrigger id="province" className="w-[300px]">
                                        <SelectValue placeholder="Select a province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Provinces</SelectLabel>
                                            {provinces.map((item, idx) => (
                                                <SelectItem key={idx} value={item.province}>
                                                    {item.province}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Municipality */}
                            <div className="grid gap-2">
                                <Label htmlFor="municipality">Municipality</Label>
                                <Select
                                    disabled={!selectedProvince}
                                    onValueChange={(value) => {
                                        setSelectedMunicipality(value);
                                        setData('city_municipality', value);
                                        setSelectedBarangay(null);
                                    }}
                                >
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder={selectedProvince ? 'Select a municipality' : 'Select province first'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Municipalities</SelectLabel>
                                            {municipalities.map((item, idx) => (
                                                <SelectItem key={idx} value={item.municipality}>
                                                    {item.municipality}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="grid gap-2">
                                <Label>Type of Assistance</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a assistance" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="food-item">Food-Items</SelectItem>
                                        <SelectItem value="non-food-item">Non-Food-Items</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Particular</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a particular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="family-food-pack">Family Food Pack</SelectItem>
                                        <SelectItem value="hygiene-kit">Hygiene Kit</SelectItem>
                                        <SelectItem value="sleeping-kit">Sleeping Kit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="pace-x-2s flex items-center">
                                <div className="grid gap-2">
                                    <Label>Quantity</Label>
                                    <Input type="number" />
                                </div>
                                <div className="grid-cols p-">
                                    <Button variant="destructive" type="button">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* PURPOSE */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea id="purpose" value={data.purpose} onChange={(e) => setData('purpose', e.target.value)} />
                                <InputError message={errors.purpose} />
                            </div>
                            <div>
                                <Label>Mode of Transportation</Label>
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="family-food-pack">Family Food Pack</SelectItem>
                                        <SelectItem value="hygiene-kit">Hygiene Kit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4">
                            {/* LEFT SIDE - FILE UPLOADS */}
                            <div className="grid gap-4">
                                <Label htmlFor="certificate_file">Attach Certificate of Depletion of QRF Fund</Label>
                                <Input id="pdf_file" type="file" onChange={handleFileChange} />
                                <InputError message={errors.pdf_file} />

                                <Label htmlFor="request_letter_file">Attach Request Letter</Label>
                                <Input id="request_letter_file" type="file" onChange={handleFileChange} />
                                <InputError message={errors.request_letter_file} />

                                <Label htmlFor="report_file">Attach Report of Affected Families</Label>
                                <Input id="report_file" type="file" onChange={handleFileChange} />
                                <InputError message={errors.report_file} />
                            </div>
                            {/* RIGHT SIDE */}
                            <div className="flex items-start gap-4">
                                {/* SEPARATOR */}
                                <Separator orientation="vertical" className="h-full w-[6px] rounded from-black/50 dark:from-white/50" />

                                {/* LIST OF TEXT */}
                                <ul className="list-disc space-y-2 pl-4 text-sm">
                                    <li>Make sure files are PDF format</li>
                                    <li>Max file size is 5MB</li>
                                    <li>Attach all required documents</li>
                                    <li>Ensure all files are updated</li>
                                </ul>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="mt-4 flex justify-end gap-4">
                            <Button type="button" variant="secondary">
                                Clear
                            </Button>
                            <Button type="submit" tabIndex={4} disabled={processing || (showCustomInput && !data.type_of_disaster.trim())}>
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
