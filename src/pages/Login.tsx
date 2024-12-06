import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { login } from "store/slices/authSlice";
import { userLogin } from "api/services/user.services";
import { userCredentials } from "interfaces/auth.model";
import { AxiosError } from "interfaces/errors.model";
import { setLocalStorageItems } from "helpers/global";
import * as ROUTES from "constants/routes";

const Login = () => {
  const dispatch = useDispatch();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const signinFunc = useMutation(userLogin, {
    async onSuccess(response) {
      const { token } = response;

      let localUser = {
        token: token,
      };
      setLocalStorageItems(localUser);
      dispatch(login());
    },
    onError(error: AxiosError<{ error: string }>) {
      toast.error(error.response?.data.error);
    },
  });

  const onSubmit = (data: userCredentials) => {
    signinFunc.mutate(data);
  };

  const signInForm = () => (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="text-muted">
          Email <span className="text_danger"> *</span>
        </label>
        <input
          {...register("email", {
            required: {
              value: true,
              message: "Email is required!",
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address",
            },
          })}
          type="email"
          className="form-control"
          style={{
            borderColor: !errors.email ? "" : "red",
          }}
        />
        {errors["email"] && (
          <p className="text_danger">{errors["email"].message as string}</p>
        )}
      </div>
      <div className="form-group">
        <label className="text-muted">
          Password <span className="text_danger"> *</span>
        </label>
        <input
          {...register("password", { required: true })}
          type="password"
          className="form-control"
          style={{
            borderColor: !errors.password ? "" : "red",
          }}
        />
        {errors["password"] && (
          <p className="text_danger">Password is required!</p>
        )}
      </div>
      <button type="submit" className="btn btn-primary mt-4">
        Login
      </button>
    </form>
  );

  return (
    <section className="container">
      <ToastContainer />
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into Your Account
      </p>
      {signInForm()}
      <p className="my-1">
        Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
      </p>
    </section>
  );
};

export default Login;
