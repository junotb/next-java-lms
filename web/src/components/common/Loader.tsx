export default function Loader() {
  return (
    <div
      className="flex-1 flex items-center justify-center"
      aria-label="Loading"
      role="status"
    >
      <div className="border-2 w-6 h-6 animate-spin rounded-full border-muted-foreground border-t-transparent" />
    </div>
  );
}