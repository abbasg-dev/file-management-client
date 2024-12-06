import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { logout } from "store/slices/authSlice";
import { clearLocalStorageItems } from "helpers/global";
import * as ROUTES from "constants/routes";

const Header = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    clearLocalStorageItems();
    dispatch(logout());
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="navbar bg-dark p-2">
      <h1 className="m-0">
        <Link to={ROUTES.HOME}>
          <i className="fas fa-code"></i>
        </Link>
      </h1>
      <ul className="m-0">
        {isLoggedIn ? (
          <>
            <li>
              <button className="logout-btn" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span className="hide-sm"> Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={ROUTES.LOGIN}>Login</Link>
            </li>
            <li>
              <Link to={ROUTES.REGISTER}>Register</Link>
            </li>
            <li>
              <Link to={ROUTES.HOME}>Home</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
