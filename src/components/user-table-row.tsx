import { Lock, Unlock, UserCheck, UserX } from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, ConfirmDialog, TableCell, TableRow } from "@/components";
import { ROLE_PERMISSIONS, toastOnError } from "@/lib";
import { AccountService } from "@/services";

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
} as const;

const getStatusConfig = (enabled: boolean) => {
  return enabled ? STATUS_CONFIG.active : STATUS_CONFIG.inactive;
};

export const UserTableRow = ({ user, onDeactivated }: { user: User; onDeactivated: VoidFunction }) => {
  const roleInfo = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] ?? {};
  const { icon: RoleIcon, color: roleColor, name: roleName } = roleInfo;

  const { color: statusColor, icon: StatusIcon, text: statusText } = getStatusConfig(user.enabled);

  const handleDeactivate = useCallback(
    async (hide: VoidFunction) => {
      try {
        await AccountService.deactive(user.userId);
        toast.success("User deactivated successfully.");
        onDeactivated();
        hide();
      } catch (e) {
        toastOnError(e);
      }
    },
    [user.userId, onDeactivated],
  );

  const handleReactivate = async () => {
    try {
      await AccountService.reactive(user.userId);
      toast.success("User reactivated successfully.");
    } catch (e) {
      toastOnError(e);
    }
  };

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
        <Badge className={roleColor}>
          <div className="flex items-center space-x-1">
            {RoleIcon && <RoleIcon className="h-3 w-3" />}
            <span>{roleName}</span>
          </div>
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={statusColor}>
          <div className="flex items-center space-x-1">
            <StatusIcon className="h-3 w-3" />
            <span>{statusText}</span>
          </div>
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {user.enabled ? (
            <ConfirmDialog onConfirm={handleDeactivate} title="Deactivate User" itemName={user.fullName}>
              <Button disabled={!user.enabled} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Unlock />
              </Button>
            </ConfirmDialog>
          ) : (
            <Button onClick={handleReactivate} disabled={user.enabled} variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
              <Lock />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
