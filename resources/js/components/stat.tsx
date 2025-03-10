import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck, ClockAlert, History, RefreshCw } from 'lucide-react';

export default function Stat() {
    return (
        <div className="grid gap-6 p-2 md:grid-cols-4">
            {/* Stats Cards */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-red-500">Pending Requests</CardTitle>
                    <ClockAlert className="h-12 w-12 text-red-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-red-500">12,345</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-blue-500">On Process</CardTitle>
                    <RefreshCw className="h-12 w-12 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-blue-500">23,456</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-orange-500">For Release</CardTitle>
                    <History className="h-12 w-12 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-orange-500">1,234</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-green-500">Released</CardTitle>
                    <CircleCheck className="h-12 w-12 text-green-500" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-green-500">1,234</p>
                </CardContent>
            </Card>
        </div>
    );
}
