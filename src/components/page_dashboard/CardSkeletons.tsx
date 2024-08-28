export function ReportsCardSkeleton() {
  return (
    <div className="card-large">
      <div className="card-large-inner">
        <div className="card-large-left"></div>
        <div className="card-large-content shimmer">
          <h3>REPORTS</h3>
          <ul className="grid-4x">
            <li>
              <output className="largeNum">?</output>PENDING
            </li>
            <li>
              <output className="largeNum">?</output>APPROVED
            </li>
            <li>
              <output className="largeNum">?</output>DENIED
            </li>
            <li>
              <output className="largeNum">?</output>LIFETIME
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function OtherCountSkeleton({ title }: { title: string }) {
  return (
    <div className="card-large">
      <div className="card-large-inner">
        <div className="card-large-left"></div>
        <div className="card-large-content shimmer">
          <h3>{title}</h3>
          <output className="largeNum">?</output>TOTAL
        </div>
      </div>
    </div>
  );
}
