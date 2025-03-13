import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { z } from 'zod';

interface Post {
    id?: number;
    title: string;
    content: string;
    picture?: string;
}

type Municipality = {
    municipality: string;
};

type Province = {
    province: string;
};

interface Props {
    // isOpen: boolean;
    // closeModal: () => void;
    post?: Post | null;
}

const formSchema = z.object({
    date: z.date().nullable(),
    disasterType: z.string().min(1, 'Required'),
    requestTo: z.string().min(1, 'Required'),
    province: z.string().min(1, 'Required'),
    municipality: z.string().min(1, 'Required'),
    barangay: z.string().min(1, 'Required'),
    city: z.string().optional(),
    purpose: z.string().min(1, 'Required'),
    transportMode: z.string().min(1, 'Required'),
    feedbackReport: z.any().optional(),
    situationalReport: z.any().optional(),
    assistance: z
        .array(
            z.object({
                type: z.string().min(1, 'Required'),
                item: z.string().min(1, 'Required'),
                quantity: z.number().min(1, 'Must be at least 1'),
            }),
        )
        .min(1, 'Add at least one assistance'),
});

export default function PostNewRequest({ post }: Props) {
    const [formData, setFormData] = useState<Post>({ title: '', content: '', picture: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    const [date, setDate] = useState<Date | undefined>(undefined);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [barangays, setBarangays] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: null,
            disasterType: '',
            requestTo: 'Region III - Central Luzon',
            province: '',
            municipality: '',
            barangay: '',
            city: '',
            purpose: '',
            transportMode: '',
            feedbackReport: null,
            situationalReport: null,
            assistance: [{ type: '', item: '', quantity: 0 }],
        },
    });

    const { register, control, setValue } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'assistance',
    });

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
                // const isUpdating = !!post?.id;

                Swal.fire({
                    title: 'Message!',
                    text: 'Your request has been saved.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    background: '#a9a9a9',
                    color: '#000000',
                    confirmButtonColor: '#000000',
                    timer: 2000, // <-- auto-close after 2 seconds
                    timerProgressBar: true, // Optional: shows a progress bar at the top
                    customClass: {
                        popup: 'custom-swal-popup',
                        icon: 'custom-icon-color',
                    },
                });

                router.reload();
            },
            onError: (errors) => {
                toast.error(errors.message || 'Something went wrong.');
            },
        });
    };

    // ✅ Fetch Provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('/provinces?region=Region%20III%20(Central%20Luzon)');
                const data = await res.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    // ✅ Fetch Municipalities on province select
    useEffect(() => {
        if (!selectedProvince) return;
        const fetchMunicipalities = async () => {
            try {
                const res = await fetch(`/municipalities/${selectedProvince}`);
                const data = await res.json();
                setMunicipalities(data);
                setBarangays([]);
                setValue('municipality', '');
                setValue('barangay', '');
            } catch (error) {
                console.error('Error fetching municipalities:', error);
            }
        };

        fetchMunicipalities();
    }, [selectedProvince, setValue]);

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            {/* Date of Request */}
            <div>
                <Label>Date of Request</Label>
                <div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                {date ? format(date, 'dd/MM/yyyy') : 'dd/mm/yyyy'}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                    setDate(d);
                                    setValue('date', d);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Disaster Type & Request To */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Type of Disaster</Label>
                    <Select onValueChange={(value) => setValue('disasterType', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="armed conflict">Armed Conflict</SelectItem>
                            <SelectItem value="covid-19">COVID-19</SelectItem>
                            <SelectItem value="drought - dry spell">Drought - Dry Spell</SelectItem>
                            <SelectItem value="earthquake">Earthquake</SelectItem>
                            <SelectItem value="el niño">El Niño</SelectItem>
                            <SelectItem value="fire incident">Fire Incident</SelectItem>
                            <SelectItem value="flash flood">Flash Flood</SelectItem>
                            <SelectItem value="flooding">Flooding</SelectItem>
                            <SelectItem value="heavy rain">Heavy Rain</SelectItem>
                            <SelectItem value="low pressure area">Low Pressure Area</SelectItem>
                            <SelectItem value="landslide">Landslide</SelectItem>
                            <SelectItem value="northeast monsoon">Northeast Monsoon</SelectItem>
                            <SelectItem value="oil spill">Oil Spill</SelectItem>
                            <SelectItem value="severe tropical storm">Severe Tropical Storm</SelectItem>
                            <SelectItem value="social disorganization">Social Disorganization</SelectItem>
                            <SelectItem value="southwest moonson">Southwest Monsoon</SelectItem>
                            <SelectItem value="storm surge">Storm Surge</SelectItem>
                            <SelectItem value="strong wind">Strong Wind</SelectItem>
                            <SelectItem value="tornado">Tornado</SelectItem>
                            <SelectItem value="tropical depresssion">Tropical Depression</SelectItem>
                            <SelectItem value="tropical storm">Tropical Storm</SelectItem>
                            <SelectItem value="Typhoon">Typhoon</SelectItem>
                            {/* Add more items as needed */}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Request To</Label>
                    <Input {...register('requestTo')} readOnly />
                </div>
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-2 gap-4">
                {/* Province Select */}
                <div>
                    <Label>Province</Label>
                    <Select
                        onValueChange={(value) => {
                            setValue('province', value);
                            setSelectedProvince(value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map((prov) => (
                                <SelectItem key={prov.province} value={prov.province}>
                                    {prov.province}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Municipality Select */}
                <div>
                    <Label>City / Municipality</Label>
                    <Select
                        disabled={!selectedProvince}
                        onValueChange={(value) => {
                            setValue('municipality', value);
                            setSelectedMunicipality(value);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                        <SelectContent>
                            {municipalities.map((mun) => (
                                <SelectItem key={mun.municipality} value={mun.municipality}>
                                    {mun.municipality}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Barangay Select */}
            {/* <div>
                        <Label>Barangay</Label>
                        <Select disabled={!selectedMunicipality} onValueChange={(value) => setValue('barangay', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select barangay" />
                            </SelectTrigger>
                            <SelectContent>
                                {barangays.map((brgy) => (
                                    <SelectItem key={brgy.barangay} value={brgy.barangay}>
                                        {brgy.barangay}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}

            {/* Assistance Items */}
            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                    <div>
                        <Label>Type of Assistance</Label>
                        <Select onValueChange={(value) => setValue(`assistance.${index}.type`, value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="food">Food Item</SelectItem>
                                <SelectItem value="medical">Non-Food Item</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Particular</Label>
                        <Input {...register(`assistance.${index}.item`)} placeholder="Item name" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <div>
                            <Label>Quantity</Label>
                            <Input type="number" {...register(`assistance.${index}.quantity`, { valueAsNumber: true })} />
                        </div>
                        {fields.length > 1 && (
                            <Button variant="destructive" onClick={() => remove(index)} type="button">
                                <Trash className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ type: '', item: '', quantity: 0 })}>
                <Plus className="mr-2 h-4 w-4" /> Add Assistance
            </Button>

            {/* Purpose */}
            <div>
                <Label>Purpose</Label>
                <Textarea {...register('purpose')} placeholder="Enter purpose..." />
            </div>

            {/* Transport Mode */}
            <div>
                <Label>Mode of Transportation</Label>
                <Select onValueChange={(value) => setValue('transportMode', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Attach Feedback Report</Label>
                    <Input type="file" {...register('feedbackReport')} />
                </div>
                <div>
                    <Label>Attach Situational Report</Label>
                    <Input type="file" {...register('situationalReport')} />
                </div>
            </div>

            {/* <div className="space-y-2">
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
            )} */}
            <div className="mt-4 flex justify-end gap-4">
                <Button type="button" variant="secondary">
                    Clear
                </Button>
                <Button type="submit">{post ? 'Update' : 'Submit'}</Button>
            </div>
        </form>
    );
}
