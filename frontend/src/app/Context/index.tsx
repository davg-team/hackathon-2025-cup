import { isExpired } from "shared/jwt-tools";
import { Context, DataType } from "./Context";
import { Fragment, ReactNode, useState } from "react";

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [providers, setProviders] = useState<DataType[]>([]);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [isLoggined, setIsLoggined] = useState<boolean>(
    localStorage.getItem("isLoggined") === "true" &&
      !isExpired(localStorage.getItem("token") as string)
      ? true
      : false,
  );
  const [isSnow, setIsSnow] = useState<boolean>(
    localStorage.getItem("isSnow") === "0",
  );

  return (
    <Fragment>
      <Context.Provider
        value={{
          providers,
          setProviders,
          isLoggined,
          setIsLoggined,
          isSnow,
          setIsSnow,
          isOpenLogin,
          setIsOpenLogin,
        }}
      >
        {children}
      </Context.Provider>
    </Fragment>
  );
};

export default AppContextProvider;

export { Context };
export type { DataType };
