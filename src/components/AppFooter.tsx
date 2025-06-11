export function AppFooter() {
  return (
    <footer className="py-8 bg-card border-t mt-auto">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PixelClean. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by AI Magic</p>
      </div>
    </footer>
  );
}
