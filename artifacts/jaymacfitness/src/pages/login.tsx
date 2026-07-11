import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Dumbbell, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  if (user) {
    return (
      <Navigate
        to={user.role === "TRAINER" ? "/dashboard" : "/portal"}
        replace
      />
    );
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      await login(data);
      toast({ title: "Welcome back!" });
    } catch (err: any) {
      toast({
        title: "Login failed",
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

  return (
    <main
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
              style={{ fontSize: "44px", lineHeight: 1, color: "#FFFFFF" }}
            >
              WELCOME <span style={{ color: "#1E90FF" }}>BACK.</span>
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
              Sign in to your client portal or trainer dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                style={inputStyle}
                {...register("email")}
              />
              {errors.email && (
                <p
                  style={{
                    color: "#FF6B6B",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" style={labelStyle}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                style={inputStyle}
                {...register("password")}
              />
              {errors.password && (
                <p
                  style={{
                    color: "#FF6B6B",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                  }}
                >
                  {errors.password.message}
                </p>
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
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div
            className="mt-6 pt-5 text-center space-y-2"
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
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "#1E90FF", fontWeight: 600 }}
                className="hover:underline"
              >
                Create one
              </Link>
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                color: "#C8D8E8",
                opacity: 0.45,
              }}
            >
              Demo trainer: trainer@example.com / Admin1234!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
