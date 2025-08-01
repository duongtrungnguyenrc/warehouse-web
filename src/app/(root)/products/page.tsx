"use client";

import { on } from "events";
import { Plus, Search } from "lucide-react";
import { type ChangeEvent, useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CategoryManagementDialog,
  CreateProductDialog,
  ImportDialog,
  Input,
  Pagination,
  RoleProtect,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  UpdateProductDialog,
} from "@/components";
import { FilterDropdown, PageHeaderSkeleton, SearchFilterSkeleton, TableSkeleton } from "@/components";
import { useListing } from "@/hooks";
import { ProductService } from "@/services";

const SEARCH_COLUMNS: ColumnConfig<Product>[] = [
  { key: "name", label: "Name", visible: true, sortable: true, searchable: true },
  { key: "sku", label: "SKU", visible: true, sortable: true, searchable: true },
  { key: "unitOfMeasure", label: "Unit of measure", visible: true, sortable: true, searchable: true },
  { key: "category", label: "Category", visible: true, sortable: true, searchable: true },
];

const SKELETON_ROWS = 10;
const DEBOUNCE_DELAY = 500;

const ProductRow = ({ product, onUpdatedSuccess }: { product: Product; onUpdatedSuccess: (updatedProduct: Product) => void }) => (
  <TableRow key={product.id}>
    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
    <TableCell>
      <div>
        <div className="font-medium">{product.name}</div>
        <div className="text-sm text-muted-foreground">{product.unitOfMeasure}</div>
      </div>
    </TableCell>
    <TableCell>{product.category.name}</TableCell>
    <TableCell>
      <div className="flex items-center space-x-1">
        <span className="font-medium">{product.stockQuantity}</span>
        <span className="text-sm text-muted-foreground">{product.unitOfMeasure}</span>
      </div>
    </TableCell>
    <RoleProtect role={["MANAGER"]}>
      <TableCell>
        <UpdateProductDialog product={product} onUpdatedSuccess={onUpdatedSuccess} />
      </TableCell>
    </RoleProtect>
  </TableRow>
);

const ProductsPage = () => {
  const [searchField, setSearchField] = useState<keyof Product>("name");

  const { data, query, setQuery, loading, append, update } = useListing({
    fetcher: ProductService.list,
  });

  const products = useMemo(() => data?.content ?? [], [data?.content]);

  const searchConfig = useMemo(
    () => ({
      field: searchField,
      value: (query[searchField] as string) || "",
    }),
    [searchField, query],
  );

  const onSearchChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery({
      ...query,
      [searchField]: e.target.value || undefined,
      page: 0,
    });
  }, DEBOUNCE_DELAY);

  const onSearchFieldChange = useCallback(
    (newSearchField: keyof Product) => {
      setQuery({
        ...query,
        [searchField]: undefined,
        page: 0,
      });
      setSearchField(newSearchField);
    },
    [searchField, query, setQuery],
  );

  const onPageChange = (page: number) => setQuery({ page });

  const onImportSuccess = useCallback((data: Product[]) => append(...data), [append]);

  const onUpdatedSuccess = useCallback(
    (updatedProduct: Product) => {
      update(
        (prev) => prev.id === updatedProduct.id,
        () => updatedProduct,
      );
    },
    [update],
  );

  const isInitialLoading = loading && !data;
  const isSearching = loading && !!data;

  return (
    <div className="space-y-6">
      {isInitialLoading ? (
        <PageHeaderSkeleton />
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">Manage the list of products and stock in the warehouse</p>
          </div>
          <RoleProtect role={["MANAGER"]}>
            <div className="flex items-center space-x-2">
              <RoleProtect role={["MANAGER"]}>
                <CategoryManagementDialog />
              </RoleProtect>

              <ImportDialog
                title="Import Products"
                description="Upload product list from Excel or CSV"
                onUpload={ProductService.importProducts}
                onSuccess={onImportSuccess}
                templateDownloader={ProductService.getImportTemplate}
              />

              <CreateProductDialog>
                <Button>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </CreateProductDialog>
            </div>
          </RoleProtect>
        </div>
      )}

      {isInitialLoading ? (
        <SearchFilterSkeleton />
      ) : (
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search by name or SKU..." onChange={onSearchChange} className="pl-10 bg-white" disabled={isSearching} />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          <FilterDropdown<Product> columns={SEARCH_COLUMNS} searchConfig={searchConfig} onSearchFieldChange={onSearchFieldChange} />
        </div>
      )}

      {isInitialLoading ? (
        <TableSkeleton rows={SKELETON_ROWS} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>Manage detailed information of products in stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {isSearching && (
                <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">Searching...</span>
                  </div>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <RoleProtect role={["MANAGER"]}>
                      <TableHead>Action</TableHead>
                    </RoleProtect>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 && !isSearching ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => <ProductRow key={product.id} product={product} onUpdatedSuccess={onUpdatedSuccess} />)
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="flex justify-center mt-5">
                        <Pagination currentPage={query.page} onChangePage={onPageChange} pageCount={data?.totalPages ?? 1} />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsPage;
