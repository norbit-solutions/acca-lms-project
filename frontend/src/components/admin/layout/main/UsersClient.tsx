"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services";
import type { AdminUser, PaginatedResponse } from "@/types";
import { showError } from "@/lib/toast";
import { UsersHeader, UsersSearch, UsersTable } from "../../components/users";

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
      (async () => {
        try {
          const result = await adminService.getUsers({ page, limit: 20 });
          setUsers(result.users || []);
          setMeta(result.meta || null);
        } catch (error) {
          console.log("Failed to load users:", error);
          showError("Failed to load users");
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
      console.log("Failed to load users:", error);
      showError("Failed to load users");
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
      console.log("Failed to search users:", error);
      showError("Failed to search users");
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchMode(false);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <UsersHeader meta={meta} />

      <UsersSearch
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        searchMode={searchMode}
      />

      <UsersTable
        users={users}
        searchMode={searchMode}
        meta={meta}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
