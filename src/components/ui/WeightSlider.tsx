interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  helper?: string;
}

export function WeightSlider({ label, value, onChange, helper }: WeightSliderProps) {
  const pct = Math.round(value);
  return (
    <div className="rounded-xl border border-outline bg-white p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-sm font-semibold text-primary min-w-[44px] text-center">
          {pct}
        </span>
      </div>
      {helper && <p className="text-xs text-on-surface-2 mb-3">{helper}</p>}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-surface-container accent-primary cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-on-surface-2 mt-1">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}
