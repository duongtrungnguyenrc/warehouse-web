"use client";

import { Edit, Settings } from "lucide-react";
import { useCallback, useState } from "react";

import { CreateCategoryDialog } from "./create-category-dialog";
import { UpdateCategoryDialog } from "./update-category-dialog";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import { useListing } from "@/hooks";
import { CategoryService } from "@/services";

export const CategoryManagementDialog = () => {
  const [open, setOpen] = useState(false);

  const { data, loading, append, update } = useListing({
    fetcher: CategoryService.list,
    initialQuery: { page: 0, size: 20 },
  });

  const categories = data?.content || [];

  const handleCreate = useCallback(
    (newCategory: Category) => {
      append(newCategory);
    },
    [append],
  );

  const handleUpdate = useCallback(
    (updatedCategory: Category) => {
      update(
        (prev) => prev.id === updatedCategory.id,
        () => updatedCategory,
      );
    },
    [update],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Categories
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Category Management</DialogTitle>
          <DialogDescription>Create, edit, and manage categories for your warehouse.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create Button */}
          <div className="flex justify-end">
            <CreateCategoryDialog onSuccess={handleCreate} />
          </div>

          {/* Category List */}
          <div className="grid gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : categories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">No categories found</p>
                  <CreateCategoryDialog onSuccess={handleCreate} />
                </CardContent>
              </Card>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{category.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{category.description}</CardDescription>
                      </div>

                      <UpdateCategoryDialog category={category} onSuccess={handleUpdate}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </UpdateCategoryDialog>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>

          {!loading && categories.length > 0 && <div className="text-sm text-muted-foreground text-center">Showing {categories.length} categories</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
