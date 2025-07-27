"use client";

import { Formik } from "formik";
import Lottie from "lottie-react";
import { ArrowLeft, Loader2, Mail, Warehouse } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";

import ErrorAnim from "@/assets/lotties/anim-error.json";
import SuccessAnim from "@/assets/lotties/anim-success.json";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components";
import { useQuery } from "@/hooks";
import { AccountService } from "@/services";

type FormValues = { email: string };

const initialValues: FormValues = { email: "" };

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Please enter your email"),
});

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (values: FormValues) => {
    setEmail(values.email);
    await AccountService.forgotPassword(values);

    return true;
  };

  const { call, loading, result, error } = useQuery(handleSubmit);

  const renderStatusView = () => {
    const isSuccess = result && !error;

    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="flex justify-center items-center">
          <Lottie className="w-36 h-36" animationData={isSuccess ? SuccessAnim : ErrorAnim} loop={false} />
        </CardHeader>
        <CardContent>
          <h2 className="text-center text-xl font-bold text-gray-900">{isSuccess ? "Request Sent!" : "Request Failed!"}</h2>
          <p className="text-center text-gray-600 text-sm mt-3">
            {isSuccess
              ? `We've sent a password reset link to ${(<strong>{email}</strong>)}. Please check your inbox.`
              : "Something went wrong. Please check your email or try again later."}
          </p>
          <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        {result != null || error != null ? (
          renderStatusView()
        ) : (
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={call}>
            {({ handleSubmit, getFieldProps, touched, errors }) => (
              <Card className="shadow-lg border-0">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl text-center">Reset Password</CardTitle>
                  <CardDescription className="text-center">We'll send instructions to your email</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input id="email" type="email" placeholder="example@company.com" className="h-11 pl-10" {...getFieldProps("email")} />
                      </div>
                      {touched.email && errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Request"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </Formik>
        )}

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

export default ForgotPasswordPage;
