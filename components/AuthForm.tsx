"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OtpModal from "./otpModal";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({ 
    email: z.string().email("Please enter a valid email address"),
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(2, "Full name must be at least 2 characters")
            .max(50, "Full name must be less than 50 characters")
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = type === "sign-up" ? await createAccount({
        fullName: values.fullName || "",
        email: values.email,
      }) : await signInUser({ email: values.email });

      setAccountId(user.accountId);
      console.log(user);
    } catch { 
      setErrorMessage("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Logo/Header */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="auth-form bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="form-title mb-6">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h2>

          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-6">
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">
                    {type === "sign-up" ? "Email" : "Username"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={
                        type === "sign-up" ? "Enter your email" : "shadcn"
                      }
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                {type === "sign-up" && (
                  <p className="text-[12px] text-light-200 mt-1 ml-4">
                    This is your public display name.
                  </p>
                )}
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="form-submit-button w-full mb-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="mr-2 animate-spin"
                />
                {type === "sign-in" ? "Signing In..." : "Creating Account..."}
              </div>
            ) : type === "sign-in" ? (
              "Sign In"
            ) : (
              "Submit"
            )}
          </Button>

          {errorMessage && (
            <p className="error-message mb-4">*{errorMessage}</p>
          )}

          <div className="text-[14px] leading-[20px] font-normal flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand hover:text-brand-100 transition-colors"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {accountId && (
        <OtpModal accountId={accountId} email={form.getValues("email")} />
      )}
    </div>
  );
};

export default AuthForm;
