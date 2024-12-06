import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "pages/Layout";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import { LoggedOutRoute } from "helpers/routes";
import * as ROUTES from "constants/routes";

const App = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path={ROUTES.LOGIN}
            element={<LoggedOutRoute outlet={<Login />} />}
          />
          <Route
            path={ROUTES.REGISTER}
            element={<LoggedOutRoute outlet={<Register />} />}
          />
        </Route>
        <Route path="*" element={<Navigate replace to={ROUTES.HOME} />} />
      </Routes>{" "}
    </>
  );
};

export default App;
