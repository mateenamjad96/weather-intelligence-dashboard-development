export default function SegmentedControl({ options, value, onChange, ariaLabel, className = "" }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`seg ${className}`}>
      {options.map((option) => {
        const OptionIcon = option.icon;
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            className="seg-btn"
            onClick={() => onChange(option.value)}
          >
            {OptionIcon && <OptionIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
