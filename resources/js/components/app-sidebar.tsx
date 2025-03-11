import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FileCheck,
    FileClock,
    FileCog,
    FileInput,
    FileOutput,
    FilePen,
    FilePlus,
    Folder,
    HandHelping,
    LayoutGrid,
    MonitorCog,
    ShieldEllipsisIcon,
    UserRoundPlus,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'Requests',
        url: '#',
        icon: HandHelping,
        isActive: true,
        items: [
            {
                title: 'New Request',
                url: '/new_request',
                icon: FilePlus,
                badge: '',
            },

            {
                title: 'Queue Request',
                url: '/posts',
                icon: FileClock,
                badge: '3',
            },

            {
                title: 'Recommendations',
                url: '/for_recommendation',
                icon: FileInput,
                badge: '2',
            },

            {
                title: 'On Process',
                url: '/on_process',
                icon: FileCog,
                badge: '5',
            },

            {
                title: 'Pending Release',
                url: '/pending_release',
                icon: FileOutput,
                badge: '1',
            },

            {
                title: 'Released',
                url: '/released',
                icon: FileCheck,
                badge: '5',
            },

            {
                title: 'Report',
                url: '/report',
                icon: FilePen,
            },
        ],
    },

    {
        title: 'Admin Access Control',
        url: '#',
        icon: ShieldEllipsisIcon,
        isActive: true,
        items: [
            {
                title: 'User Accounts',
                url: '/user_accounts',
                icon: UserRoundPlus,
            },

            {
                title: 'Web Page Control',
                url: '/web_page_control',
                icon: MonitorCog,
            },

            {
                title: 'Report',
                url: '/for_report',
                icon: FilePen,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
