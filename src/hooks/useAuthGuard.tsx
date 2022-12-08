import { systemModalVar } from "@cache/index";
import { AUTH_TOKEN_KEY } from "@constants/auth";
import { Pathnames } from "@constants/index";
import { useNavigate } from "react-router-dom";

const useAuthGuard = () => {
  const navigate = useNavigate();

  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    navigate(Pathnames.Login);

    systemModalVar({
      ...systemModalVar(),
      isVisible: false,
    });
  }

  return;
};

export default useAuthGuard;
