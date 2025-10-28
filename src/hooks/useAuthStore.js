import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { clearErrorMessage, onLogin, onLogout } from "../store";
import { AxiosError } from "axios";

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const { status, user, errorMessage } = useSelector((state) => state.auth);

  const startLogin = async ({ email, password }) => {
    try {
      const { data } = await calendarApi.post("/auth", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (err) {
      dispatch(onLogout("Credenciales incorrectas"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ name, email, password }) => {
    try {
      const { data } = await calendarApi.post("/auth/new", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid || "" }));
    } catch (error) {
      let message = error.response?.data?.msg;

      if (Array.isArray(message)) {
        message = message.join(", ");
      }

      if (!message) {
        message = "Error en la autenticación";
      }

      dispatch(onLogout(message));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 3000);
    }
  };

  return {
    status,
    user,
    errorMessage,

    startLogin,
    startRegister,
  };
};
