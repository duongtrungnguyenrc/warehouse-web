"use client";

import { Formik } from "formik";
import { type ReactNode, useCallback } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { WarehouseSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { catchError, ROLE_PERMISSIONS } from "@/lib";
import { AccountService } from "@/services";

type CreateUserDialogProps = {
  children: ReactNode;
  onUserCreated: (user: User) => void;
};

type FormValues = {
  fullName: string;
  address: string;
  phone: string;
  dob: string;
  gender: Gender;
  email: string;
  role: Role;
  warehouseId?: string;
};

const initialValues: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  role: Object.keys(ROLE_PERMISSIONS)[0] as Role,
  address: "",
  dob: new Date().toISOString().substring(0, 10),
  gender: "MALE",
};

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required").min(2, "Full name must be at least 2 characters"),
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9()+-\\s]+$/, "Phone number can only contain digits, spaces, parentheses, plus or minus signs"),
  role: Yup.string().required("Please select a role"),
  address: Yup.string().required("Address is required").min(5, "Address must be at least 5 characters"),
  dob: Yup.string()
    .required("Date of birth is required")
    .test("dob", "Date of birth must be in the past", (value) => {
      if (!value) return false;
      return new Date(value) < new Date();
    }),
  gender: Yup.string().oneOf(["MALE", "FEMALE"], "Please select a valid gender").required("Gender is required"),
});

export const CreateUserDialog = ({ children, onUserCreated }: CreateUserDialogProps) => {
  const handleSubmit = useCallback(
    async (values: FormValues, { resetForm }: { resetForm: VoidFunction }) =>
      await toast.promise(AccountService.register(values), {
        success: (newUser) => {
          onUserCreated(newUser);
          resetForm();

          return "User created successfully.";
        },
        loading: "Creating new user...",
        error: catchError,
      }),
    [onUserCreated],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Enter user information to create a new account in the system.</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" name="fullName" value={values.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
                  {touched.fullName && errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" value={values.phone} onChange={handleChange} placeholder="e.g. 0901234567" />
                  {touched.phone && errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} placeholder="e.g. john.doe@company.com" />
                {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" value={values.address} onChange={handleChange} placeholder="e.g. 123 Main St" />
                {touched.address && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input id="dob" name="dob" type="date" value={values.dob} onChange={handleChange} max={new Date().toISOString().substring(0, 10)} />
                  {touched.dob && errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={values.gender} onValueChange={(value) => setFieldValue("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {touched.gender && errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Select
                  value={values.role}
                  onValueChange={async (value) => {
                    await setFieldValue("warehouseId", undefined);
                    await setFieldValue("role", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_PERMISSIONS).map(([role, info]) => (
                      <SelectItem key={`register:role:${role}`} value={role}>
                        {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched.role && errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>

              {(["MANAGER", "INVENTORY_STAFF"] as Role[]).includes(values.role) && (
                <div className="space-y-2">
                  <Label>Warehouse *</Label>
                  <WarehouseSelect value={values.warehouseId} setFieldValue={setFieldValue} />
                  {touched.role && errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
