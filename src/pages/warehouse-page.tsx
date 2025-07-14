import { RoleProtect } from "@/components";
import { WarehouseDetailPage } from "@/pages/warehouse-detail-page.tsx";
import { WarehouseManagementPage } from "@/pages/warehouse-management-page.tsx";

export const WarehousesPage = () => {
  return (
    <>
      <RoleProtect role={["ADMIN"]}>
        <WarehouseManagementPage />
      </RoleProtect>

      <RoleProtect role={["MANAGER", "INVENTORY_STAFF"]}>
        <WarehouseDetailPage />
      </RoleProtect>
    </>
  );
};
