export function CardLarge({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="card-large">
      <div className="card-large-inner">
        <div className="card-large-left"></div>
        <div className="card-large-content">
          <h3>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}
