function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center p-8">
      {children}
    </main>
  );
}

export default AuthLayout;
