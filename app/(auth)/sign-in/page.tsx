"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trello, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ToastError, ToastSuccess } from "@/lib/toast";

export default function SignInPage() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!values.email) {
      newErrors.email = "Email is required";
      ToastError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Invalid email format";
      ToastError("Invalid email format");
    }

    if (!values.password) {
      newErrors.password = "Password is required";
      ToastError("Password is required");
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        // Save JWT token in cookie, expires in 7 days
        Cookies.set("token", data.token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        ToastSuccess("Login successful!");
        router.push("/");
      } else {
        ToastError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      ToastError("Server error. Try again later.");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // Optionally decode JWT to get userId
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
        const userId = payload.id || payload.userId; // adjust depending on your token structure
        router.replace(`/${userId}`);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [router]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <Trello className="text-blue-500" size={32} />
        <CardTitle className="text-center text-xl">
          Log in to continue
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
            required
          />
        </div>

        {/* Password */}
        <div className="grid gap-2 mt-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Log in
        </Button>

        <Link
          href={"/sign-up"}
          className="hover:underline transition-all duration-150"
        >
          Don’t have an account? Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
