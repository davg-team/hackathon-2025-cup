import { Context } from "app/Context";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const {setIsLoggined} = useContext(Context)

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("temp_token");
    localStorage.removeItem("isLoggined")
    setIsLoggined(false)
    document.cookie = `token=; path=/; domain=.${location.hostname.split(".").slice(-2).join(".")}; max-age=0; samesite=strict`;
    navigate("/");
  }, []);

  return <></>
}

export default Logout