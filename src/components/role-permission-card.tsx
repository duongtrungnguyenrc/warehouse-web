"use client";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn";
import { ROLE_PERMISSIONS } from "@/lib";

export const RolePermissionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Role Permissions</CardTitle>
      <CardDescription>Detailed permissions for each role in the system</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
