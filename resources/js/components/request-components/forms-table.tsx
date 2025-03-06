import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const requests = [
    {
        requestNo: 'RN-2022-09-06-0013',
        date: '2022-09-06',
        requestedBy: 'Angat, Bulacan',
        disasterType: 'Fire Incident',
        particular: 'Family Food Pack',
        quantity: 10,
        purpose: 'Fire Incident',
        status: 'Pending',
        validated: true,
    },
    {
        requestNo: 'RN-2022-09-20-0014',
        date: '2022-09-20',
        requestedBy: 'Mexico, Pampanga',
        disasterType: 'Sample Purpose',
        particular: 'Family Food Pack',
        quantity: 100,
        purpose: 'Sample Purpose',
        status: 'Pending',
        validated: false,
    },

    {
        requestNo: 'RN-2022-09-20-0014',
        date: '2022-09-20',
        requestedBy: 'Mexico, Pampanga',
        disasterType: 'Sample Purpose',
        particular: 'Family Food Pack',
        quantity: 100,
        purpose: 'Sample Purpose',
        status: 'Pending',
        validated: false,
    },
    {
        requestNo: 'RN-2022-09-20-0014',
        date: '2022-09-20',
        requestedBy: 'Mexico, Pampanga',
        disasterType: 'Sample Purpose',
        particular: 'Family Food Pack',
        quantity: 100,
        purpose: 'Sample Purpose',
        status: 'Pending',
        validated: false,
    },
    {
        requestNo: 'RN-2022-09-20-0014',
        date: '2022-09-20',
        requestedBy: 'Mexico, Pampanga',
        disasterType: 'Sample Purpose',
        particular: 'Family Food Pack',
        quantity: 100,
        purpose: 'Sample Purpose',
        status: 'Pending',
        validated: false,
    },
    {
        requestNo: 'RN-2022-09-20-0014',
        date: '2022-09-20',
        requestedBy: 'Mexico, Pampanga',
        disasterType: 'Sample Purpose',
        particular: 'Family Food Pack',
        quantity: 100,
        purpose: 'Sample Purpose',
        status: 'Pending',
        validated: false,
    },
    // Add more entries as needed
];

export default function RequestTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);

    const totalPages = Math.ceil(requests.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = requests.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
        <div className="rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between pb-4">
                <Select onValueChange={(value) => setEntriesPerPage(Number(value))}>
                    <SelectTrigger className="w-30">
                        <SelectValue placeholder={`${entriesPerPage} entries`} />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 30, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size} entries
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="text" placeholder="Search..." className="w-64 rounded-md border px-3 py-2" />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
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
                    {currentEntries.map((request, index) => (
                        <TableRow key={index}>
                            <TableCell>{request.requestNo}</TableCell>
                            <TableCell>{request.date}</TableCell>
                            <TableCell>{request.requestedBy}</TableCell>
                            <TableCell>{request.disasterType}</TableCell>
                            <TableCell>{request.particular}</TableCell>
                            <TableCell>{request.quantity}</TableCell>
                            <TableCell>{request.purpose}</TableCell>
                            <TableCell>
                                <Badge variant="destructive">{request.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <input type="checkbox" checked={request.validated} readOnly />
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end pt-4">
                <Pagination>
                    <PaginationContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
