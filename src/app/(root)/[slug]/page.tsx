import { FC } from "react";

import { WarehouseDetailPage as WarehouseDetailPageContent } from "../warehouse-detail-page";

type WarehouseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const WarehouseDetailPage: FC<WarehouseDetailPageProps> = async ({ params }) => {
  const { slug } = await params;
  return <WarehouseDetailPageContent slug={slug} />;
};

export default WarehouseDetailPage;
