import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
import type { PaginatedResponse, AdminUser } from "@/types";

interface UsersPaginationProps {
    meta: PaginatedResponse<AdminUser>["meta"];
    page: number;
    onPageChange: (page: number) => void;
}

export default function UsersPagination({ meta, page, onPageChange }: UsersPaginationProps) {
    if (meta.totalPages <= 1) return null;

    const getPageNumbers = () => {
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
    );
}
