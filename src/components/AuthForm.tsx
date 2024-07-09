/* eslint-disable react/jsx-pascal-case */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  type AuthType,
  signInAPI,
  signUpCustomerAPI,
  signUpManagerAPI,
} from "@/apiCallers/auth";
import type { CredentialsArgument } from "@/apiCallers/login";
import { Icons } from "@/components/icons";
import type { ResponseType } from "@/lib/error";
import { cn } from "@/lib/utils";
import { RoleEnum } from "@/types";
import { SignInServer } from "@/utils/serverActions";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "sign-in" | "sign-up";
  role?: RoleEnum.CUSTOMER | RoleEnum.MANAGER;
}

const SignUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(3).max(20),
    username: z.string().min(0).max(10).optional(),
    passwordConfirm: z.string().min(3).max(20),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });
const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});

type SignUpSchemaType = z.infer<typeof SignUpSchema>;
type SignInSchemaType = z.infer<typeof SignInSchema>;
export function UserAuthForm({
  className,
  type = "sign-up",
  role,
  ...props
}: UserAuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType & SignInSchemaType>({
    resolver: zodResolver(type === "sign-up" ? SignUpSchema : SignInSchema),
    defaultValues: {},
  });

  const { mutateAsync: signUpCustomerMutate } = useMutation({
    mutationFn: async (data: AuthType) => {
      return signUpCustomerAPI(data);
    },
    onSuccess: (data: ResponseType) => {
      if (!data.ok) {
        if (data.error) {
          const errs = data.error as { [key: string]: { message: string } };
          Object.entries(errs).forEach(([key, value]) => {
            setError(key as keyof SignUpSchemaType, {
              type: "manual",
              message: value.message,
            });
          });
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });
        throw new Error(data.message || data.statusText);
      }
      if (data.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: data.message,
        });
      }
      return toast({
        variant: "default",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
  });

  const { mutateAsync: signUpManagerMutate } = useMutation({
    mutationFn: async (data: AuthType) => {
      return signUpManagerAPI(data);
    },
    onSuccess: (data: ResponseType) => {
      if (!data.ok) {
        if (data.error) {
          const errs = data.error as { [key: string]: { message: string } };
          Object.entries(errs).forEach(([key, value]) => {
            setError(key as keyof SignUpSchemaType, {
              type: "manual",
              message: value.message,
            });
          });
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });
        throw new Error(data.message || data.statusText);
      }
      if (data.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: data.message,
        });
      }
      return toast({
        variant: "default",
        title: "Submitted successfully",
        description: "You can do something else now",
      });
    },
  });

  const { mutateAsync: signInMutate } = useMutation({
    mutationFn: async (data: CredentialsArgument) => {
      return signInAPI(data);
    },

    onSuccess: async (data: ResponseType) => {
      console.log(data);
      if (!data.ok) {
        if (data.error) {
          const errs = data.error as { [key: string]: { message: string } };
          Object.entries(errs).forEach(([key, value]) => {
            setError(key as keyof SignInSchemaType, {
              type: "manual",
              message: value.message,
            });
          });
        }
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message || data.statusText,
        });
        throw new Error(data.message || data.statusText);
      }
      if (data.message) {
        return toast({
          variant: "default",
          className: "bg-green-600 text-white",
          title: "Message from system",
          description: data.message,
        });
      }
      if (data) {
        toast({
          variant: "default",
          title: "Login successfully",
          description: "You can do something else now",
        });
      }
      // const data2 = getValues();

      return true;
    },
  });
  const onSubmit: SubmitHandler<SignUpSchemaType & SignInSchemaType> = async (
    data
  ) => {
    try {
      if (type === "sign-up") {
        if (role === RoleEnum.CUSTOMER) {
          await signUpCustomerMutate({
            email: data.email,
            password: data.password,
            username: data?.username || (data.email as string),
          });
        } else {
          await signUpManagerMutate({
            email: data.email,
            password: data.password,
            username: data?.username || (data.email as string),
          });
        }
        router.push("/sign-in");
      }
      if (type === "sign-in") {
        const rest = await signInMutate({
          email: data.email,
          password: data.password,
        });

        if (rest.data.accessToken) {
          await SignInServer({
            email: rest.data.accessToken,
            password: rest.data.refreshToken,
          });
        }
      }
    } catch (err) {
      console.log(err, "cath error");
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label
              className={cn(
                "flex items-center justify-start gap-1",
                errors.email && "text-destructive"
              )}
              htmlFor="email"
            >
              <span>Email</span>
              <span className="font-medium text-destructive">*</span>
            </Label>
            <Input
              {...register("email")}
              id="email"
              className={cn(
                errors.email &&
                  "ring-offset-destructive  focus-visible:ring-0 border-destructive  text-destructive"
              )}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-xs capitalize text-destructive">
                {errors.email?.message}
              </span>
            )}
          </div>
          {type === "sign-up" && (
            <div className="grid gap-2">
              <Label
                className={cn(
                  "flex items-center justify-start gap-1",
                  errors?.username && "text-destructive"
                )}
                htmlFor="username"
              >
                <span>Username</span>
                <span className="font-medium ">(Optional)</span>
              </Label>
              <Input
                {...register("username")}
                id="username"
                placeholder="username"
                type="text"
                disabled={isSubmitting}
                className={cn(
                  errors.username &&
                    "ring-offset-destructive  focus-visible:ring-0 border-destructive  text-destructive"
                )}
              />
              {errors.username && (
                <span className="text-xs capitalize text-destructive">
                  {errors.username?.message}
                </span>
              )}
            </div>
          )}
          <div className="grid gap-2">
            <Label
              className={cn(
                "flex items-center justify-start gap-1",
                errors.password && "text-destructive"
              )}
              htmlFor="password"
            >
              <span>Password</span>
              <span className="font-medium text-red-500">*</span>
            </Label>
            <Input
              {...register("password")}
              id="password"
              placeholder="Password"
              className={cn(
                errors.password &&
                  "ring-offset-destructive  focus-visible:ring-0 border-destructive  text-destructive"
              )}
              type="password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="text-xs capitalize text-destructive">
                {errors.password?.message}
              </span>
            )}
          </div>
          {type === "sign-up" && (
            <div className="grid gap-2">
              <Label
                className={cn(
                  "flex items-center justify-start gap-1",
                  errors.passwordConfirm && "text-destructive"
                )}
                htmlFor="passwordConfirm"
              >
                <span>Password Confirmation</span>
                <span className="font-medium text-red-500">*</span>
              </Label>
              <Input
                {...register("passwordConfirm")}
                className={cn(
                  errors.passwordConfirm &&
                    "ring-offset-destructive  focus-visible:ring-0 border-destructive  text-destructive"
                )}
                id="passwordConfirm"
                placeholder="Confirm your password"
                type="password"
              />
              {errors.passwordConfirm && (
                <span className="text-xs capitalize text-destructive">
                  {errors.passwordConfirm?.message}
                </span>
              )}
            </div>
          )}

          <Button
            variant="default"
            className="mt-2 "
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {type === "sign-up" ? "Create your account" : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
}
