import { FormEvent, useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import styles from "./AuthForm.module.css";

const AuthForm: React.FC = () => {
  const history = useHistory();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authCtx = useContext(AuthContext);

  const inputRefEmail = useRef<HTMLInputElement>(null);
  const inputRefPassword = useRef<HTMLInputElement>(null);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    const enteredEmail: string = inputRefEmail.current!.value;
    const enteredPassword: string = inputRefPassword.current!.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAjV7Xhvik3-tp9VEFYqYvi1lMK9Rx3C28";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAjV7Xhvik3-tp9VEFYqYvi1lMK9Rx3C28";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime: Date = new Date(
          new Date().getTime() + ((+data.expiresIn) * 1000)
        );
        authCtx.login(data.idToken, expirationTime);
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={styles.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={styles.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={inputRefEmail} />
        </div>
        <div className={styles.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={inputRefPassword}
          />
        </div>
        <div className={styles.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={styles.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
