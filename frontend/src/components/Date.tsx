function DateInfo({
  prefixText,
  date,
}: {
  prefixText: "scheduled" | "created";
  date: Date;
}) {
  return (
    <span className="shrink-0 text-xs self-end italic">
      {prefixText} at {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
}

export default DateInfo;