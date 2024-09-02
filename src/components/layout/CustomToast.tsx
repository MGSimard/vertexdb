import { ToastIconWarning, Checkmark } from "@/components/icons";

type IconOptions = "success" | "warning";

const iconMap: Record<IconOptions, JSX.Element> = {
  warning: <ToastIconWarning />,
  success: <Checkmark />,
};

export function CustomToast({ icon, message = "SYSTEM MALFUNCTION" }: { icon: IconOptions; message: string }) {
  return (
    <div className={`custom-toast${" " + icon}`}>
      <div className="toast-icon">{iconMap[icon]}</div>
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
