/** Flat tooltip for recharts that follows the theme tokens. */
export const ChartTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-pop">
      {(label ?? payload[0].name) && <p className="font-medium text-fg">{label ?? payload[0].name}</p>}
      <p className="text-fg-muted">
        <span className="font-semibold tabular-nums text-fg">{payload[0].value}</span> {unit}
      </p>
    </div>
  );
};
