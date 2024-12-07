"use client";
import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Email must be valid."),
  password: z.string().min(6, "Password should have at least 6 characters."),
});

const Page = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );
      console.log("rsponse", response);

      const { token } = response.data;

      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="signUpWrapper">
      <div className="formWrapper">
        <div className="left">
          <h3 className="title">Welcome Friends!</h3>
          <p>Choose your favorite Car</p>
        </div>
        <div className="right">
          <h3 className="tag">Sign In Here</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="input-tags">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="input-fileds"
                        placeholder="john@example.com"
                        {...field}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0 mb-2">
                    <FormLabel className="input-tags">Password</FormLabel>
                    <FormControl>
                      <Input
                        className="input-fileds"
                        placeholder="*********"
                        type="password"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="loginBtn">
                Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
