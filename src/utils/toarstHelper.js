import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showCorrectAnswerToast = () => {
  toast.success("Correct answer!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const showIncorrectAnswerToast = () => {
  toast.error("Incorrect answer!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
