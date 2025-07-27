"use client";

import { Formik } from "formik";
import { AlertCircle, ArrowLeft, Loader2, Warehouse } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components";
import { useQuery } from "@/hooks";
import { toastOnError } from "@/lib";
import { AccountService } from "@/services";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const initialValues: FormValues = {
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  newPassword: Yup.string().required("Please enter a new password").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const verifySession = useCallback(() => AccountService.verifyResetPasswordToken({ token }), [token]);
  const { loading: verifying, result: tokenValid, error: verifyError, call } = useQuery(verifySession);

  useEffect(() => {
    call();
  }, [call]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        await AccountService.resetPassword({
          ...values,
          token: token!,
        });

        toast.success("Password reset successfully.");
        router.replace("/login");
      } catch (e) {
        toastOnError(e);
      }
    },
    [navigator, token],
  );

  if (!token) return redirect("/login");

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!tokenValid || verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="flex justify-center">
            <div className="bg-red-600 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Invalid session</h1>
          <p className="text-gray-600">The reset password link is invalid or has expired. Please request a new one.</p>
          <Link href="/forgot-password">
            <Button className="mt-4">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Warehouse className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">Enter your current and new password to proceed</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ handleSubmit, getFieldProps, touched, errors }) => (
            <Card className="shadow-lg border-0">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">Change Password</CardTitle>
                <CardDescription className="text-center">Ensure your new password is strong</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password</Label>
                    <Input id="newPassword" type="password" className="h-11" placeholder="Enter a new password" {...getFieldProps("newPassword")} />
                    {touched.newPassword && errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" className="h-11" placeholder="Re-enter new password" {...getFieldProps("confirmPassword")} />
                    {touched.confirmPassword && errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>

                  <Button type="submit" className="w-full h-11">
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </Formik>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Login
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>&copy; 2024 Warehouse Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
