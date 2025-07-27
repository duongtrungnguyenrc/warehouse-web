import { WarehouseDetailPage } from "./warehouse-detail-page";
import { WarehouseManagementPage } from "./warehouse-management-page";

import { RoleProtect } from "@/components";

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
