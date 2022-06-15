import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

import styles from "./MainNavigation.module.css";

const MainNavigation: React.FC = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;
  const logOutHandler = () => {
    authCtx.logout();
  };

  return (
    <header className={styles.header}>
      <Link to="/">
        <div className={styles.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logOutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
