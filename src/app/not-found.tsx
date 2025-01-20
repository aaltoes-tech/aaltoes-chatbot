export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">404 Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}
