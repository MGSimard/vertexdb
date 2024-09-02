export function CustomToast({ message = "SYSTEM MALFUNCTION" }: { message?: string }) {
  return (
    <div className="custom-toast">
      <div className="toast-icon">ICON</div>
      <div className="toast-frame">
        <div className="toast-inner">
          <div className="toast-trim"></div>
          <div className="toast-content">{message}</div>
          <div className="toast-trim"></div>
        </div>
      </div>
    </div>
  );
}
