import { RoleProtect } from "@/components";
import { WarehouseManagementPage } from "./warehouse-management-page";
import { WarehouseDetailPage } from "./warehouse-detail-page";

const WarehousesPage = () => {
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

export default WarehousesPage;
