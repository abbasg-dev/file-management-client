import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { AxiosResponse } from "axios";
import { userRegister } from "api/services/user.services";
import { RegisterUser } from "interfaces/auth.model";
import { AxiosError } from "interfaces/errors.model";
import * as ROUTES from "constants/routes";

const Register = () => {
  let navigate = useNavigate();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<RegisterUser>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const signupFunc = useMutation(userRegister, {
    async onSuccess(response: AxiosResponse) {
      toast.success(response.data.message);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    },
    onError(error: AxiosError<{ error: string }>) {
      toast.error(error.response?.data.error);
    },
  });

  const onSubmit = (data: RegisterUser) => {
    let body = data;
    signupFunc.mutate(body);
  };

  const signUpForm = () => (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-sm">
          <div className="form-group">
            <label className="text-muted">
              Full Name <span className="text_danger"> *</span>
            </label>
            <input
              {...register("username", {
                required: {
                  value: true,
                  message: "Full name is required!",
                },
              })}
              type="text"
              className="form-control"
              style={{
                borderColor: !errors.username ? "" : "red",
              }}
              name="username"
            />
            {errors["username"] && (
              <p className="text_danger">
                {errors["username"].message as string}
              </p>
            )}
          </div>
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
              name="email"
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
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required!",
                },
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
                  message: "Wrong password security criteria",
                },
              })}
              style={{
                borderColor: !errors.password ? "" : "red",
              }}
              type="password"
              placeholder="Password"
              name="password"
              className="form-control"
            />
            {errors["password"] && (
              <p className="text_danger">
                {errors["password"].message as string}
              </p>
            )}
          </div>
        </div>
      </div>
      <input type="submit" className="btn btn-primary" value="Register" />
    </form>
  );

  return (
    <section className="container">
      <ToastContainer />
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      {signUpForm()}
      <p className="my-1">
        Already have an account? <Link to={ROUTES.LOGIN}>Signin</Link>
      </p>
    </section>
  );
};

export default Register;
