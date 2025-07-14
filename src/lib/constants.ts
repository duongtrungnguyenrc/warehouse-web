import { Shield, User, UserCheck } from "lucide-react";

export const NO_REFRESH_ROUTES = ["/account/refresh", "/account/login"];

export const PERMISSIONS: Record<Permission, string> = {
  SYSTEM_MANAGEMENT: "Manage entire system",
  USER_MANAGEMENT: "Manage users",
  WAREHOUSE_MANAGEMENT: "Create/edit/delete warehouses",
  INVENTORY_TRACKING: "Track inventory",
  WAREHOUSE_REPORT_VIEW: "View warehouse reports",
  IMPORT_EXPORT_MANAGEMENT: "Manage imports/exports",
  STOCK_WARNING: "Stock warnings",
  SHIPMENT_MANAGEMENT: "Manage shipments",
  BARCODE_SCAN: "Scan barcodes/QR codes",
  INVENTORY_UPDATE: "Update inventory",
  DOCUMENT_CREATION: "Create import/export documents",
  TRANSACTION_HISTORY_VIEW: "Track transaction history",
  SCHEDULE_NOTIFICATION: "Receive schedule notifications",
  DOCUMENT_HANDLING: "Handle documentation",
  CONFIGURATION_MANAGEMENT: "System configuration",
};

export const ROLE_PERMISSIONS: Record<Role, RolePermission> = {
  ADMIN: {
    name: "Administrator",
    color: "bg-red-50 text-red-700",
    icon: Shield,
    permissions: [
      PERMISSIONS.SYSTEM_MANAGEMENT,
      PERMISSIONS.WAREHOUSE_MANAGEMENT,
      PERMISSIONS.USER_MANAGEMENT,
      PERMISSIONS.WAREHOUSE_REPORT_VIEW,
      PERMISSIONS.CONFIGURATION_MANAGEMENT,
    ],
  },
  MANAGER: {
    name: "Warehouse Manager",
    color: "bg-blue-50 text-blue-700",
    icon: UserCheck,
    permissions: [
      PERMISSIONS.WAREHOUSE_MANAGEMENT,
      PERMISSIONS.INVENTORY_TRACKING,
      PERMISSIONS.WAREHOUSE_REPORT_VIEW,
      PERMISSIONS.IMPORT_EXPORT_MANAGEMENT,
      PERMISSIONS.STOCK_WARNING,
    ],
  },
  INVENTORY_STAFF: {
    name: "Inventory Staff",
    color: "bg-green-50 text-green-700",
    icon: User,
    permissions: [PERMISSIONS.INVENTORY_TRACKING, PERMISSIONS.SHIPMENT_MANAGEMENT, PERMISSIONS.BARCODE_SCAN, PERMISSIONS.INVENTORY_UPDATE],
  },
};

export const WAREHOUSE_TYPE: Record<WarehouseType, string> = {
  DC: "Distribution Center",
  CW: "Central Warehouse",
};
