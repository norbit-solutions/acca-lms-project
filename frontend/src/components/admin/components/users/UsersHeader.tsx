import { UsersIcon } from "@/lib/icons";
import type { PaginatedResponse, AdminUser } from "@/types";

interface UsersHeaderProps {
    meta: PaginatedResponse<AdminUser>["meta"] | null;
}

export default function UsersHeader({ meta }: UsersHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                    Users
                </h1>
                <p className="text-slate-500 mt-1">
                    Manage registered users and their accounts
                </p>
            </div>
            {meta && (
                <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <UsersIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{meta.total}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Total Users</p>
                    </div>
                </div>
            )}
        </div>
    );
}
