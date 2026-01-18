'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    User
} from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '@/types/roles';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const role = session?.user?.role;

    const startNavigation = [
        { name: 'Dashboard', href: `/${role === 'SUPER_ADMIN' ? 'super-admin' : role === 'COACH' ? 'coach' : 'student'}`, icon: LayoutDashboard, roles: [UserRole.SUPER_ADMIN, UserRole.COACH, UserRole.STUDENT] },
    ];

    const adminNav = [
        { name: 'Coaching Centers', href: '/super-admin/coaches', icon: Users, roles: [UserRole.SUPER_ADMIN] },
        { name: 'Requests', href: '/super-admin/requests', icon: User, roles: [UserRole.SUPER_ADMIN] },
        { name: 'All Quizzes', href: '/super-admin/quizzes', icon: BookOpen, roles: [UserRole.SUPER_ADMIN] },
        { name: 'Settings', href: '/super-admin/settings', icon: Settings, roles: [UserRole.SUPER_ADMIN] },
    ];

    const coachNav = [
        { name: 'Categories', href: '/coach/categories', icon: BookOpen, roles: [UserRole.COACH] },
        { name: 'Question Bank', href: '/coach/questions', icon: BookOpen, roles: [UserRole.COACH] },
        { name: 'Quizzes', href: '/coach/quizzes', icon: BookOpen, roles: [UserRole.COACH] },
        { name: 'Students', href: '/coach/students', icon: Users, roles: [UserRole.COACH] },
    ];

    const studentNav = [
        { name: 'Marketplace', href: '/student/marketplace', icon: BookOpen, roles: [UserRole.STUDENT] },
        { name: 'My Quizzes', href: '/student/quizzes', icon: BookOpen, roles: [UserRole.STUDENT] },
        { name: 'History', href: '/student/history', icon: GraduationCap, roles: [UserRole.STUDENT] },
    ];

    const getNavItems = () => {
        let items = [...startNavigation];
        if (role === UserRole.SUPER_ADMIN) items = [...items, ...adminNav];
        if (role === UserRole.COACH) items = [...items, ...coachNav];
        if (role === UserRole.STUDENT) items = [...items, ...studentNav];
        return items;
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-gray-900">Apex Quiz</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-blue-600" : "text-gray-400")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center mb-4 px-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{role?.toLowerCase()?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                        onClick={() => signOut()}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed w-full z-20 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="flex items-center">
                        <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-900">Apex Quiz</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="px-4 py-2 bg-white border-b border-gray-200 shadow-lg">
                        <nav className="space-y-1 pb-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center px-3 py-2 text-base font-medium rounded-md",
                                        pathname === item.href
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            ))}
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 mt-2"
                                onClick={() => signOut()}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
