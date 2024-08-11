import "react-toastify/dist/ReactToastify.css";
import "./Notification.scss";

import {
  ToastContainer,
  ToastContainerProps,
  ToastOptions,
  TypeOptions,
  toast,
} from "react-toastify";

interface NotificationProps extends ToastContainerProps {}

interface NotificationToast {
  content: any;
  type?: TypeOptions;
  options?: ToastOptions;
}

export enum ToastTypes {
  Info = "info",
  Error = "error",
  Success = "success",
  Warning = "warning",
  Default = "default",
}

export const Notification = (props: NotificationProps) => {
  return (
    <ToastContainer
      rtl={props.rtl}
      role={props.role}
      icon={props.icon}
      limit={props.limit}
      style={props.style}
      onClick={props.onClick}
      className={props.className}
      bodyStyle={props.bodyStyle}
      draggable={props.draggable}
      theme={props.theme || "dark"}
      toastStyle={props.toastStyle}
      newestOnTop={props.newestOnTop}
      closeButton={props.closeButton}
      containerId={props.containerId}
      pauseOnHover={props.pauseOnHover}
      closeOnClick={props.closeOnClick}
      autoClose={props.autoClose || 3000}
      bodyClassName={props.bodyClassName}
      progressStyle={props.progressStyle}
      toastClassName={props.toastClassName}
      hideProgressBar={props.hideProgressBar}
      position={props.position || "top-right"}
      pauseOnFocusLoss={props.pauseOnFocusLoss}
      draggablePercent={props.draggablePercent}
      progressClassName={props.progressClassName}
      draggableDirection={props.draggableDirection}
      // enableMultiContainer={props.enableMultiContainer}
    />
  );
};

export const Notify = (props: NotificationToast) => {
  switch (props.type) {
    case ToastTypes.Info:
      return toast.info(props.content, props.options);
    case ToastTypes.Error:
      return toast.error(props.content, props.options);
    case ToastTypes.Success:
      return toast.success(props.content, props.options);
    case ToastTypes.Warning:
      return toast.warning(props.content, props.options);
    default:
      return toast(props.content, props.options);
  }
};
