"use client";
import { loginSchema } from "@/pages/Authentication/LoginPage/LoginScheema";
import InputCommon from "@/components/common/InputCommon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loginUser } from "@/store/Actions/authActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function LoginPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const handleFormSubmit = async (data) => {
    try {
      console.log("Login attempt with:", data);
      await dispatch(loginUser(data)).unwrap();
      router.push("/home");
    } catch (err) {
      console.error(err);
    }

    // Add your authentication logic here
  };
  const handleFormError = (err) => {
    console.error(err);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Login</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <InputCommon
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  control={form.control}
                />
              </div>

              <div className="space-y-2">
                <InputCommon
                  control={form.control}
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  inputType="password"
                  iconOnClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  icon={
                    showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hover-blue-full"
              isLoading={auth.isLoading}
            >
              Log in
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
