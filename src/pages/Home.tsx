import { Pathnames } from "@constants/index";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = {
      email: "",
    };

    if (!user.email) {
      navigate(Pathnames.Login);
    }
  }, []);

  return <div></div>;
};

export default Home;
