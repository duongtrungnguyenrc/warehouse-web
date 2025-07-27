"use client";

import { Formik } from "formik";
import { AlertCircle, Eye, EyeOff, Loader2, Warehouse } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components";
import { useAuth } from "@/hooks";
import { catchError } from "@/lib";

type LoginForm = {
  email: string;
  password: string;
  showPassword: boolean;
  rememberPassword: boolean;
};

const initialValues: LoginForm = {
  email: "",
  password: "",
  showPassword: false,
  rememberPassword: false,
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleLogin = async (values: LoginForm) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });

      router.replace("/");
      toast.success("Login successful");
    } catch (e) {
      catchError(e, setError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Warehouse className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Management System</h1>
          <p className="text-gray-600">Log in to continue</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
          {({ values, errors, touched, getFieldProps, setFieldValue, handleSubmit }) => (
            <Card className="shadow-lg border-0">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">Login</CardTitle>
                <CardDescription className="text-center">Enter your credentials with email and password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="admin@company.com" className="h-11" {...getFieldProps("email")} />
                    {touched.email && errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={values.showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pr-10"
                        {...getFieldProps("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setFieldValue("showPassword", !values.showPassword)}
                      >
                        {values.showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                    {touched.password && errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-end">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </Formik>

        <div className="text-center text-xs text-gray-500">
          <p>&copy; 2024 Warehouse Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
