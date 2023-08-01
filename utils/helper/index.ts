import { toast } from "react-toastify";

type TypeToast = "success" | "info" | "error" | "warning" | "default";

export const showToastMessage = (message: string, typeToast: TypeToast) => {
  toast(message, {
    position: "top-right",
    type: typeToast,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
