import { Context } from "app/Context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteToken } from "shared/jwt-tools";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsLoggined } = useContext(Context);

  useEffect(() => {
    deleteToken();
    deleteToken();
    deleteToken();
    deleteToken();
    deleteToken();
    localStorage.removeItem("temp_token");
    localStorage.removeItem("isLoggined");
    setIsLoggined(false);
    navigate("/");
  }, []);

  return <></>;
};

export default Logout;

