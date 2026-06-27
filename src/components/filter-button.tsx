export default function FilterButton({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
        active
          ? "bg-ieee-dark text-white border-ieee-dark"
          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}
