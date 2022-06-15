import { FormEvent, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import styles from "./ProfileForm.module.css";

const ProfileForm: React.FC = () => {
  const history = useHistory();

  const inputRefNewPassword = useRef<HTMLInputElement>(null);
  const authCtx = useContext(AuthContext);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    const enteredNewPassword: string = inputRefNewPassword.current!.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAjV7Xhvik3-tp9VEFYqYvi1lMK9Rx3C28",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage =
              "Changing the old password with the new one failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((res) => history.replace("/"))
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <form className={styles.form} onSubmit={submitHandler}>
      <div className={styles.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={inputRefNewPassword} />
      </div>
      <div className={styles.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
