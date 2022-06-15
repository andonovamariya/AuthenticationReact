import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

let logoutTimer: ReturnType<typeof setTimeout>;

interface AuthContextInterface {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string | null, expirationTime: Date) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextInterface>({
  token: "",
  isLoggedIn: false,
  login: (token, expirationTime) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime: Date) => {
  const currentTime: number = new Date().getTime();
  const adjustedExpirationTime: number = expirationTime.getTime();
  const remainingTime: number = adjustedExpirationTime - currentTime;
  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken: string | null = localStorage.getItem("token");
  const storedExpirationDate: string = localStorage.getItem("expirationTime")!;

  const remainingTime = calculateRemainingTime(new Date(storedExpirationDate));

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  const storedTokenData: { token: string | null; duration: number } = {
    token: storedToken,
    duration: remainingTime,
  };
  return storedTokenData;
};

export const AuthContextProvider: React.FC<PropsWithChildren> = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  } else {
    initialToken = null;
  }
  const [token, setToken] = useState<string | null>(initialToken);

  const userIsLoggedIn: boolean = !!token; //if token is a string that's not empty it will return true, if token is a string that is empty, it will return false

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token: string | null, expirationTime: Date) => {
    setToken(token);
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("expirationTime", expirationTime.toString());

      const remainingTime: number = calculateRemainingTime(expirationTime);

      logoutTimer = setTimeout(logoutHandler, remainingTime);
    }
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
