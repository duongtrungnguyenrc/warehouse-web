"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Plus, Search, User as UserIcon } from "lucide-react";
import { type ChangeEvent, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CreateUserDialog,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { FilterDropdown } from "@/components/filter-dropdown";
import { RolePermissionsCard } from "@/components/role-permission-card";
import { UserTableRow } from "@/components/user-table-row";
import { useListing } from "@/hooks";
import { AccountService } from "@/services";

const DEFAULT_COLUMNS: ColumnConfig<User>[] = [
  { key: "fullName", label: "User", visible: true, sortable: true },
  { key: "phone", label: "Phone", visible: true, sortable: true },
  { key: "email", label: "Email", visible: true, sortable: true },
  { key: "gender", label: "Gender", visible: true, sortable: true },
  { key: "dob", label: "Date of Birth", visible: true, sortable: true },
  { key: "address", label: "Address", visible: true, sortable: false },
  { key: "role", label: "Role", visible: true, sortable: true },
  { key: "enabled", label: "Status", visible: true, sortable: true },
];

const sortUsers = (users: User[], sortConfig: SortConfig<User>): User[] => {
  if (!sortConfig.field) return users;

  return [...users].sort((a, b) => {
    const aValue = a[sortConfig.field!];
    const bValue = b[sortConfig.field!];

    let comparison: number;

    if (sortConfig.field === "dob") {
      comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      comparison = Number(aValue) - Number(bValue);
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.direction === "desc" ? -comparison : comparison;
  });
};

const UserPage = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig<User>>({ field: null, direction: "asc" });
  const [columns, setColumns] = useState<ColumnConfig<User>[]>(DEFAULT_COLUMNS);

  const { data, setQuery, append, update } = useListing({
    fetcher: AccountService.list,
    initialQuery: {
      page: 0,
      size: 20,
    },
    enableCache: true,
  });

  const users = useMemo(() => data?.content ?? [], [data?.content]);

  const sortedUsers = useMemo(() => {
    return sortUsers(users, sortConfig);
  }, [users, sortConfig]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible);
  }, [columns]);

  const handleSort = (field: keyof User) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleColumnToggle = (key: keyof User) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)));
  };

  const onSearchChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => setQuery({ search: e.target.value }), 500);

  const handleDeactivatedUser = (id: string) => {
    update(
      (curr) => curr.userId === id,
      (curr) => ({ ...curr, enabled: false }),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage accounts and roles within the system</p>
        </div>
        <CreateUserDialog onUserCreated={append}>
          <Button>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </CreateUserDialog>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 bg-white">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search by name, email or user ID..." onChange={onSearchChange} className="pl-10" />
        </div>
        <FilterDropdown<User> sortConfig={sortConfig} onSort={handleSort} columns={columns} onColumnToggle={handleColumnToggle} />
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            Manage user information and permissions • {sortedUsers.length} users
            {sortConfig.field && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Sorted by {columns.find((col) => col.key === sortConfig.field)?.label} ({sortConfig.direction})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead key={column.key}>
                      {column.sortable ? (
                        <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold" onClick={() => handleSort(column.key)}>
                          {column.label}
                          {sortConfig.field === column.key ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUp className="ml-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="ml-1 h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
                          )}
                        </Button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <UserIcon className="h-8 w-8 text-gray-400" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers.map((user) => <UserTableRow onDeactivated={() => handleDeactivatedUser(user.userId)} key={user.userId} user={user} />)
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <RolePermissionsCard />
    </div>
  );
};

export default UserPage;
