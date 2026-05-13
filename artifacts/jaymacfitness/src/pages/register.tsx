import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Dumbbell, ArrowLeft } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerAuth, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  if (user) {
    return (
      <Navigate
        to={user.role === "TRAINER" ? "/dashboard" : "/portal"}
        replace
      />
    );
  }

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      await registerAuth(data);
      toast({ title: "Account created — welcome!" });
    } catch (err: any) {
      toast({
        title: "Sign up failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow', sans-serif",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.18em",
    color: "rgba(200,216,232,0.75)",
    textTransform: "uppercase",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: "rgba(10,22,40,0.6)",
    border: "1px solid #1A3A5C",
    borderRadius: "4px",
    color: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    outline: "none",
  };

  const errStyle: React.CSSProperties = {
    color: "#FF6B6B",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(circle at 20% 0%, rgba(30,144,255,0.12), transparent 55%), #0A1628",
      }}
    >
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 text-[#C8D8E8]/70 hover:text-[#1E90FF] transition-colors"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <div
          style={{
            backgroundColor: "#112240",
            border: "1px solid #1A3A5C",
            borderRadius: "6px",
            padding: "36px 32px",
            boxShadow: "0 0 40px rgba(30,144,255,0.12)",
          }}
        >
          <div className="text-center mb-8">
            <div
              className="mx-auto mb-5 flex items-center justify-center"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "rgba(30,144,255,0.12)",
                border: "1px solid rgba(30,144,255,0.4)",
              }}
            >
              <Dumbbell className="h-7 w-7" style={{ color: "#1E90FF" }} />
            </div>
            <h1
              className="headline"
              style={{ fontSize: "40px", lineHeight: 1, color: "#FFFFFF" }}
            >
              JOIN <span style={{ color: "#1E90FF" }}>HP FIT.</span>
            </h1>
            <p
              className="mt-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                color: "#C8D8E8",
                opacity: 0.75,
              }}
            >
              Create your client account to book sessions and track progress.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" style={labelStyle}>
                  First name
                </label>
                <input
                  id="firstName"
                  placeholder="John"
                  style={inputStyle}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p style={errStyle}>{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" style={labelStyle}>
                  Last name
                </label>
                <input
                  id="lastName"
                  placeholder="Doe"
                  style={inputStyle}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p style={errStyle}>{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                style={inputStyle}
                {...register("email")}
              />
              {errors.email && <p style={errStyle}>{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" style={labelStyle}>
                Phone (optional)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="07753 226 214"
                style={inputStyle}
                {...register("phone")}
              />
              {errors.phone && <p style={errStyle}>{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                style={inputStyle}
                {...register("password")}
              />
              {errors.password && (
                <p style={errStyle}>{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "wait" : "pointer",
              }}
            >
              {isLoading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div
            className="mt-6 pt-5 text-center"
            style={{ borderTop: "1px solid rgba(30,144,255,0.18)" }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                color: "#C8D8E8",
                opacity: 0.7,
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#1E90FF", fontWeight: 600 }}
                className="hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
