import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const currentUrl = page.url;
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

    // Keep submenus open if a child item is active
    useEffect(() => {
        const updatedMenus: { [key: string]: boolean } = {};
        items.forEach((item) => {
            if (item.items?.some((child) => child.url === currentUrl)) {
                updatedMenus[item.title] = true;
            }
        });
        setOpenMenus((prev) => ({ ...prev, ...updatedMenus }));
    }, [currentUrl, items]);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title], // Toggle the menu
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0;
                    const isExpanded = openMenus[item.title] || false;
                    const isActive = currentUrl === item.url || (hasChildren && item.items.some((child) => child.url === currentUrl));

                    return (
                        <div key={item.title}>
                            <SidebarMenuItem>
                                {hasChildren ? (
                                    <SidebarMenuButton onClick={() => toggleMenu(item.title)} isActive={isActive}>
                                        {item.icon && <item.icon className="mr-2" />}
                                        <span>{item.title}</span>
                                        {item.badge && (
                                            <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>
                                        )}
                                        {isExpanded ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />}
                                    </SidebarMenuButton>
                                ) : (
                                    <SidebarMenuButton asChild isActive={isActive}>
                                        <Link href={item.url!} prefetch>
                                            {item.icon && <item.icon className="mr-2" />}
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>

                            {/* Render sub-items if the menu is expanded */}
                            {hasChildren && isExpanded && (
                                <div className="pl-4">
                                    {item.items.map((child) => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton asChild isActive={child.url === currentUrl}>
                                                <Link href={child.url!} prefetch>
                                                    {child.icon && <child.icon className="mr-2" />}
                                                    <span>{child.title}</span>
                                                    {child.badge && (
                                                        <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                                                            {child.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
