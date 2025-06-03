import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
import { Film } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-muted">
        <Link href="/" className="absolute top-8 left-8 flex items-center space-x-2">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CinemaSeats</span>
        </Link>
        
        <div className="w-full max-w-md mx-auto">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}