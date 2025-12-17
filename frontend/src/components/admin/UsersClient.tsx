"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/services";
import type { AdminUser, PaginatedResponse } from "@/types";

// Icons
const UsersIcon = () => (
  <svg
    className="w-12 h-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function UsersClient({
  initialUsers = [],
  initialMeta = null,
}: {
  initialUsers?: AdminUser[];
  initialMeta?: PaginatedResponse<AdminUser>["meta"] | null;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers || []);
  const [meta, setMeta] = useState<PaginatedResponse<AdminUser>["meta"] | null>(
    initialMeta || null
  );
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    if (!searchMode) {
      // reload page when page changes
      (async () => {
        try {
          const result = await adminService.getUsers({ page, limit: 20 });
          setUsers(result.users || []);
          setMeta(result.meta || null);
        } catch (error) {
          console.error("Failed to load users:", error);
        }
      })();
    }
  }, [page, searchMode]);

  const loadUsers = async () => {
    try {
      const result = await adminService.getUsers({ page, limit: 20 });
      setUsers(result.users || []);
      setMeta(result.meta || null);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      loadUsers();
      return;
    }
    setSearchMode(true);
    try {
      const users = await adminService.searchUsers(searchQuery);
      setUsers(users || []);
      setMeta(null);
    } catch (error) {
      console.error("Failed to search users:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchMode(false);
    loadUsers();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Users
          </h1>
          <p className="text-slate-500 mt-1">
            Manage registered users and their accounts
          </p>
        </div>
        {meta && (
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <UsersIcon />
            <span className="font-semibold text-slate-700">{meta.total}</span>
            <span>total users</span>
          </div>
        )}
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-2 border-b border-slate-300 focus:border-slate-800 outline-none bg-transparent transition-colors rounded-none placeholder:text-slate-400"
              placeholder="Search by name, email, or phone..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-5 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-sm hover:bg-slate-800 transition-all"
            >
              Search
            </button>
            {searchMode && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <CloseIcon />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
        {searchMode && (
          <p className="mt-3 text-sm text-slate-500">
            Showing search results for &quot;
            <span className="font-semibold text-slate-700">{searchQuery}</span>
            &quot;
          </p>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {users && users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80">
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
                  {(Array.isArray(users) ? users : []).map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0 ${user.role === "admin"
                              ? "bg-purple-600"
                              : "bg-slate-900"
                              }`}
                          >
                            {user.fullName.charAt(0)}
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
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                            ? "bg-purple-50 text-purple-700"
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/50 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium transition-colors"
                        >
                          <EyeIcon />
                          <span className="hidden sm:inline">View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
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
                  <span className="font-semibold text-slate-700">
                    {meta.total}
                  </span>{" "}
                  users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <ChevronLeftIcon />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, meta.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (meta.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= meta.totalPages - 2) {
                          pageNum = meta.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${page === pageNum
                              ? "bg-slate-900 text-white shadow"
                              : "text-slate-600 hover:bg-slate-100"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === meta.totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <UsersIcon />
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
        )}
      </div>
    </div>
  );
}
