interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onReset,
}: DateRangeFilterProps) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div className="date-range-filter">
      <div className="date-filter-field">
        <label htmlFor="start-date">
          Start date
        </label>

        <input
          id="start-date"
          type="date"
          value={startDate}
          max={today}
          onChange={(event) =>
            onStartDateChange(event.target.value)
          }
        />
      </div>

      <div className="date-filter-field">
        <label htmlFor="end-date">
          End date
        </label>

        <input
          id="end-date"
          type="date"
          value={endDate}
          max={today}
          onChange={(event) =>
            onEndDateChange(event.target.value)
          }
        />
      </div>

      <button
        type="button"
        className="date-filter-apply"
        onClick={onApply}
      >
        Apply
      </button>

      <button
        type="button"
        className="date-filter-reset"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}

export default DateRangeFilter;
