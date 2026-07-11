interface MetricProps {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export function Metric({
  label,
  value,
  detail,
}: MetricProps): React.JSX.Element {
  return (
    <>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </>
  );
}
