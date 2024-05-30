import { ClerkProvider } from "@clerk/nextjs";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="flex items-center justify-center h-full">{children}</div>
    </ClerkProvider>
  );
};

export default AuthLayout;
