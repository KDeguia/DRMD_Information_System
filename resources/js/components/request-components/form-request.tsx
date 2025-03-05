import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    date: z.date().optional(),
    disasterType: z.string().nonempty('Select a disaster type'),
    requestTo: z.string().nonempty(),
    province: z.string().nonempty(),
    city: z.string().nonempty(),
    assistance: z
        .array(
            z.object({
                type: z.string().nonempty(),
                item: z.string().nonempty(),
                quantity: z.number().min(1, 'Quantity must be at least 1'),
            }),
        )
        .min(1),
    purpose: z.string().min(5, 'Enter a valid purpose'),
    transportMode: z.string().nonempty(),
    feedbackReport: z.any(),
    situationalReport: z.any(),
});

export default function DisasterRequestForm() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { assistance: [{ type: '', item: '', quantity: 1 }] },
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'assistance' });
    const [date, setDate] = useState<Date | undefined>();

    const onSubmit = (data: any) => {
        console.log('Form Submitted', data);
    };

    return (
        <Card className="mx-auto w-full max-w-3xl p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {/* Date of Request */}
                    <div>
                        <Label>Date of Request</Label>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        {date ? format(date, 'dd/MM/yyyy') : 'dd/mm/yyyy'}
                                        <CalendarIcon className="ml-2" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
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
                            <Select {...register('disasterType')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="earthquake">Earthquake</SelectItem>
                                    <SelectItem value="flood">Flood</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Request to</Label>
                            <Input {...register('requestTo')} defaultValue="Region III - Central Luzon" readOnly />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Province</Label>
                            <Input {...register('province')} />
                        </div>
                        <div>
                            <Label>City / Municipality</Label>
                            <Input {...register('city')} />
                        </div>
                    </div>

                    {/* Assistance Type */}
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                            <div>
                                <Label>Type of Assistance</Label>
                                <Select {...register(`assistance.${index}.type`)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="food">Food</SelectItem>
                                        <SelectItem value="medical">Medical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Particular</Label>
                                <Input {...register(`assistance.${index}.item`)} placeholder="Select Item Name" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <div>
                                    <Label>Quantity</Label>
                                    <Input type="number" {...register(`assistance.${index}.quantity`, { valueAsNumber: true })} />
                                </div>
                                {fields.length > 1 && (
                                    <Button variant="destructive" onClick={() => remove(index)}>
                                        <Trash />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => append({ type: '', item: '', quantity: 1 })}>
                        <Plus className="mr-2" /> Add Assistance
                    </Button>

                    {/* Purpose */}
                    <div>
                        <Label>Purpose</Label>
                        <Textarea {...register('purpose')} placeholder="Enter Purpose..." />
                    </div>

                    {/* Mode of Transport */}
                    <div className="grid-col-3 grid gap-1">
                        <Label>Mode of Transportation</Label>
                        <Select {...register('transportMode')}>
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
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Attach Feedback Report</Label>
                            <Input type="file" {...register('feedbackReport')} />
                        </div>
                        <div>
                            <Label>Attach Situational Report</Label>
                            <Input type="file" {...register('situationalReport')} />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-4 p-6">
                    <Button variant="outline" type="reset">
                        Clear
                    </Button>
                    <Button type="submit">Submit Request</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
