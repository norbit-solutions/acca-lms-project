import Link from "next/link";
import { UsersIcon, ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import type { AdminUser, PaginatedResponse } from "@/types";

interface UsersTableProps {
    users: AdminUser[];
    searchMode: boolean;
    meta?: PaginatedResponse<AdminUser>["meta"] | null;
    page?: number;
    onPageChange?: (page: number) => void;
}

export default function UsersTable({ users, searchMode, meta, page = 1, onPageChange }: UsersTableProps) {
    if (!users || users.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-16 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <UsersIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                        No users found
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {searchMode
                            ? "Try adjusting your search query to find what you're looking for."
                            : "When users register, they'll appear here."}
                    </p>
                </div>
            </div>
        );
    }

    const getPageNumbers = () => {
        if (!meta) return [];
        const pages: number[] = [];
        const maxVisible = 5;
        
        if (meta.totalPages <= maxVisible) {
            for (let i = 1; i <= meta.totalPages; i++) {
                pages.push(i);
            }
        } else if (page <= 3) {
            for (let i = 1; i <= maxVisible; i++) {
                pages.push(i);
            }
        } else if (page >= meta.totalPages - 2) {
            for (let i = meta.totalPages - maxVisible + 1; i <= meta.totalPages; i++) {
                pages.push(i);
            }
        } else {
            for (let i = page - 2; i <= page + 2; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                                Phone
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                                Joined
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="group hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0 ${
                                                user.role === "admin"
                                                    ? "bg-gradient-to-br from-purple-500 to-purple-700"
                                                    : "bg-gradient-to-br from-slate-700 to-slate-900"
                                            }`}
                                        >
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900 truncate">
                                                {user.fullName}
                                            </p>
                                            <p className="text-sm text-slate-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
                                    <span className="font-mono text-sm">{user.phone || "—"}</span>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                            user.role === "admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm hidden lg:table-cell">
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-900 rounded-full hover:bg-slate-200 text-sm font-medium transition-all"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && onPageChange && (
                <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {(meta.page - 1) * meta.limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-slate-700">
                            {Math.min(meta.page * meta.limit, meta.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700">{meta.total}</span> users
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                                        page === pageNum
                                            ? "bg-slate-900 text-white shadow"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === meta.totalPages}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
