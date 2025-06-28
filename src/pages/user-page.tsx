import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Filter, Plus, Search, User, UserCheck, UserX } from "lucide-react";
import { type ChangeEvent, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CreateUserDialog,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { useListing } from "@/hooks";
import { ROLE_PERMISSIONS } from "@/lib";
import { AccountService } from "@/services";

const DEFAULT_COLUMNS: ColumnConfig<User>[] = [
  { key: "fullName", label: "User", visible: true, sortable: true },
  { key: "phone", label: "Phone", visible: true, sortable: true },
  { key: "email", label: "Email", visible: true, sortable: true },
  { key: "gender", label: "Gender", visible: true, sortable: true },
  { key: "dob", label: "Date of Birth", visible: true, sortable: true },
  { key: "address", label: "Address", visible: true, sortable: false },
  { key: "role", label: "Role", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
];

const STATUS_CONFIG = {
  active: {
    color: "bg-green-50 text-green-700",
    text: "Active",
    icon: UserCheck,
  },
  inactive: {
    color: "bg-red-50 text-red-700",
    text: "Inactive",
    icon: UserX,
  },
  pending: {
    color: "bg-yellow-50 text-yellow-700",
    text: "Pending",
    icon: User,
  },
} as const;

const getStatusConfig = (status: string) => {
  return (
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      color: "bg-gray-50 text-gray-700",
      text: "Unknown",
      icon: User,
    }
  );
};

const sortUsers = (users: User[], sortConfig: SortConfig<User>): User[] => {
  if (!sortConfig.field) return users;

  return [...users].sort((a, b) => {
    const aValue = a[sortConfig.field!];
    const bValue = b[sortConfig.field!];

    let comparison = 0;

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

const FilterDropdown = ({
  sortConfig,
  onSort,
  columns,
  onColumnToggle,
}: {
  sortConfig: SortConfig<User>;
  onSort: (field: keyof User) => void;
  columns: ColumnConfig<User>[];
  onColumnToggle: (key: keyof User) => void;
}) => {
  const getSortIcon = (field: keyof User) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortConfig.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns
          .filter((col) => col.sortable)
          .map((column) => (
            <DropdownMenuItem key={column.key} onClick={() => onSort(column.key)} className="flex items-center justify-between">
              <span>Sort by {column.label}</span>
              {getSortIcon(column.key)}
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem key={column.key} checked={column.visible} onCheckedChange={() => onColumnToggle(column.key)}>
            <span>{column.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserTableRow = ({ user }: { user: User }) => {
  const roleInfo = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
  const RoleIcon = roleInfo?.icon;
  const statusConfig = getStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  return (
    <TableRow key={user.userId}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={user.fullName} />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm text-muted-foreground">{user.phone}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.gender ? "Male" : "Female"}</TableCell>
      <TableCell>{new Date(user.dob).toLocaleDateString("en-GB")}</TableCell>
      <TableCell className="max-w-xs truncate">{user.address}</TableCell>
      <TableCell>
        <Badge className={roleInfo?.color}>
          <div className="flex items-center space-x-1">
            {RoleIcon && <RoleIcon className="h-3 w-3" />}
            <span>{roleInfo?.name}</span>
          </div>
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={statusConfig.color}>
          <div className="flex items-center space-x-1">
            <StatusIcon className="h-3 w-3" />
            <span>{statusConfig.text}</span>
          </div>
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className={user.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}>
            {user.status === "active" ? "Disable" : "Enable"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const RolePermissionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Role Permissions</CardTitle>
      <CardDescription>Detailed permissions for each role in the system</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(ROLE_PERMISSIONS).map(([key, role]) => {
          const RoleIcon = role.icon;
          return (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <RoleIcon className="h-5 w-5" />
                <h3 className="font-semibold">{role.name}</h3>
                <Badge className={role.color}>{key}</Badge>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {role.permissions.map((permission, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

export const UserPage = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig<User>>({ field: null, direction: "asc" });
  const [columns, setColumns] = useState<ColumnConfig<User>[]>(DEFAULT_COLUMNS);

  const { data, setQuery, append } = useListing({
    fetcher: AccountService.list,
    initialQuery: {
      page: 0,
      limit: 20,
    },
    enableCache: true,
  });

  const users = data?.content ?? [];

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
            <Plus className="mr-2 h-4 w-4" />
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
        <FilterDropdown sortConfig={sortConfig} onSort={handleSort} columns={columns} onColumnToggle={handleColumnToggle} />
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
                        <User className="h-8 w-8 text-gray-400" />
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers.map((user) => <UserTableRow key={user.userId} user={user} />)
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
