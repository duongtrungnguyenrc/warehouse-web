"use client";

import { format } from "date-fns";
import { CheckCircle, ChevronRight, Clock, Download, FileText, Package, Search, X } from "lucide-react";
import { type ChangeEvent, Fragment, useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useDebouncedCallback } from "use-debounce";

import {
  Badge,
  CreateOutboundDialog,
  DateRangePicker,
  OutboundImportDialog,
  Pagination,
  RoleProtect,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  WarehouseStats,
} from "@/components";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { useDownloadFile, useListing } from "@/hooks";
import { cn } from "@/lib";
import { OutboundService } from "@/services";

const getStatusText = (status: OutboundStatus) => {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In Progress";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const getStatusIcon = (status: OutboundStatus) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4" />;
    case "IN_PROGRESS":
      return <Clock className="h-4 w-4" />;
    case "CANCELLED":
      return <FileText className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: OutboundStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 text-green-700";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

const OutboundPage = () => {
  const { download } = useDownloadFile();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { data, query, setQuery, loading, append } = useListing({
    fetcher: OutboundService.list,
  });

  const orders = data?.content || [];
  const toggleRow = (id: string) => setExpandedRow((prev) => (prev === id ? null : id));
  const onPageChange = (page: number) => setQuery({ page });

  const handleExport = async (batchId: string) => await download(() => OutboundService.exportOrder(batchId));

  const onSearchChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value === "" ? undefined : event.target.value;
    setQuery({ search });
  }, 500);

  const onRangeTimeFilterChange = useCallback(
    (rangeTime: DateRange) => {
      setQuery({
        fromDate: rangeTime.from ? format(rangeTime.from, "yyyy-MM-dd") : undefined,
        toDate: rangeTime.to ? format(rangeTime.to, "yyyy-MM-dd") : undefined,
      });
    },
    [setQuery],
  );

  const onClearFilter = useCallback(
    () =>
      setQuery({
        search: undefined,
        fromDate: undefined,
        toDate: undefined,
      }),
    [setQuery],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Outbound Management</h1>
          <p className="text-muted-foreground">Monitor and manage outbound orders</p>
        </div>

        <RoleProtect role={["INVENTORY_STAFF"]}>
          <div className="flex items-center space-x-3">
            <OutboundImportDialog />
            <CreateOutboundDialog onCreatedSuccess={append} />
          </div>
        </RoleProtect>
      </div>

      <WarehouseStats type="outbound" />

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search by batch number or supplier..." className="pl-10 bg-white" onChange={onSearchChange} />
        </div>
        <DateRangePicker onChange={onRangeTimeFilterChange} />
        {Object.entries(query).some(([key, value]) => ["search", "fromDate", "toDate"].includes(key) && !!value) && (
          <Button variant="outline" size="icon" onClick={onClearFilter}>
            <X />
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outbound Order List</CardTitle>
          <CardDescription>Track the status of outbound shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Batch Number</TableHead>
                <TableHead>Inventory Staff</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dispatched Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : orders.map((order) => {
                    const totalItems = order.details.reduce((sum, item) => sum + item.quantity, 0);
                    const totalProducts = order.details.length;
                    const isExpanded = expandedRow === order.id;

                    return (
                      <Fragment key={order.id}>
                        <TableRow className="cursor-pointer select-none">
                          <TableCell className="w-6 text-center">
                            <Button variant="ghost" size="sm" onClick={() => toggleRow(order.id)}>
                              <ChevronRight className={cn("h-5 w-5 transition-all", isExpanded && "rotate-90")} />
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">{order.batchNumber}</TableCell>
                          <TableCell>{order.inventoryStaffUser}</TableCell>
                          <TableCell>{order.createdByUser}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{totalItems.toLocaleString()} items</div>
                              <div className="text-sm text-muted-foreground">{totalProducts} types</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span>{getStatusText(order.status)}</span>
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{order.receivedDate || <span className="text-muted-foreground">Not dispatched</span>}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleExport(order.id)}>
                                <Download />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={8} className="py-4 px-0">
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse border border-gray-200">
                                  <thead>
                                    <tr>
                                      <th className="text-left p-2 border border-gray-200">SKU</th>
                                      <th className="text-left p-2 border border-gray-200">Product Name</th>
                                      <th className="text-left p-2 border border-gray-200">Quantity</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.details.map((item, idx) => (
                                      <tr key={idx} className="border-t border-gray-200">
                                        <td className="p-2 border border-gray-200">{item.product.sku}</td>
                                        <td className="p-2 border border-gray-200">{item.product.name}</td>
                                        <td className="p-2 border border-gray-200">{item.quantity.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex justify-center mt-5">
                    <Pagination currentPage={query.page} onChangePage={onPageChange} pageCount={data?.totalPages ?? 1} />
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutboundPage;
