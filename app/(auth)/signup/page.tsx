import { SignupForm } from "@/features/auth/components/signup-form";

// ================================================================================================
// Metadata of the page
// ================================================================================================
export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new ChessVolt account.",
}; 

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
