const TONES = {
  amber: "bg-amber-50 text-ieee-cs-orange",
  green: "bg-green-50 text-orange-700",
};

export default function Badge({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`${TONES[tone]} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}
    >
      {children}
    </span>
  );
}
