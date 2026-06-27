export default function EmptyState({
  message,
  actionLabel,
  onAction,
  className = "",
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`text-center py-20 bg-white rounded-xl border border-dashed border-gray-200 ${className}`}
    >
      <p className="text-gray-500 text-lg">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 text-ieee-cs-orange font-medium hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
