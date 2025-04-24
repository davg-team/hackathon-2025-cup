import { createContext } from "react";

type OAuth2Params = {
  client_id: string;
  response_type: string;
  scope: string;
};

type OAuth2Authorize = {
  url: string;
  params: OAuth2Params;
  pkce: {
    required: boolean;
    method: string;
  };
};

type OAuth2 = {
  authorize: OAuth2Authorize;
  instant_authorization: boolean;
};

type DataType = {
  slug: string;
  name: string;
  type: string;
  service: string;
  description: string;
  icon: string;
  oauth2: OAuth2;
  other_data: Record<string, unknown>;
};

type ContextType = {
  providers: DataType[];
  setProviders: React.Dispatch<React.SetStateAction<DataType[]>>;
  isLoggined: boolean;
  setIsLoggined: React.Dispatch<React.SetStateAction<boolean>>;
  isSnow: boolean;
  setIsSnow: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenLogin: boolean;
  setIsOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Context = createContext<ContextType>({
  providers: [],
  setProviders: () => {},
  isLoggined: false,
  setIsLoggined: () => {},
  isSnow: false,
  setIsSnow: () => {},
  isOpenLogin: false,
  setIsOpenLogin: () => {},
});
export type { DataType };

