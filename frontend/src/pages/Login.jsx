import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import GoogleLogo from "../assets/icons/google.svg";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useFeedback } from "../providers/FeedbackProvider";

const errorMap = {
  "auth/invalid-email": "Invalid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export default function Login() {
  const { user, setUser, isUserLoading, userLogin, loginWithGoogle } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const userCredential = await userLogin(data.email, data.password);
      return userCredential.user;
    },
    onSuccess: async (user) => { 
      setUser(user);
      showFeedback("Login successful! , Welcome", "success");
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      const message = errorMap[error.code] || "Login failed.";
      showFeedback(message, "error");
      console.log(error);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const userCredential = await loginWithGoogle();
      setUser(userCredential.user);
      return userCredential.user;
    },
    onSuccess: async (user) => {
      // Save user in database on MongoDB
      await axiosSecure.post(`/users`, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      showFeedback("Login successful! , Welcome", "success");
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      const message = errorMap[error.code] || "Login failed.";
      showFeedback(message, "error");
      console.log(error);
    },
  });

  if (isUserLoading) return <LoaderDotted />;

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <HeadTag title="LA Lead Academy | Login" />
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f] relative overflow-hidden px-4">
        {/* Subtle Brand Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8d6e3e] rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900 rounded-full blur-[150px] opacity-20" />
        
        <div className="bg-white shadow-2xl rounded-[2rem] p-10 w-full max-w-md relative z-10 border border-white/10">
          <div className="text-center mb-8">
             <h1 className="brand-text text-4xl mb-2">
                <span className="brand-la">LA</span>
                <span className="text-gray-900">LEAD Academy</span>
             </h1>
             <p className="text-gray-500 font-medium">Welcome Back!</p>
          </div>

          <form onSubmit={handleSubmit(loginMutation.mutate)}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-md px-3 py-2">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter your email"
                  className="w-full outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-md px-3 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your password"
                  className="w-full outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#8d6e3e] text-white py-3 rounded-xl hover:bg-[#725a32] transition-all duration-300 font-bold shadow-lg shadow-[#8d6e3e]/20"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              state={{ from: location.state?.from || "/" }}
              className="text-[#8d6e3e] hover:underline font-bold"
            >
              Register here
            </Link>
          </p>

          <div className="divider">OR</div>

          {/* Google Login Button */}
          <button
            className="w-full border text-gray-600 border-gray-400 py-2 rounded-md hover:shadow-lg transition duration-300"
            disabled={googleLoginMutation.isPending}
            onClick={() => googleLoginMutation.mutate()}
          >
            {
              <span className="flex items-center justify-center font-semibold">
                <img
                  src={GoogleLogo}
                  alt="Google Logo"
                  className="w-6 h-6 mr-2"
                />
                {googleLoginMutation.isPending
                  ? "Logging with Google..."
                  : "Login with Google"}
              </span>
            }
          </button>
        </div>
      </div>
    </>
  );
}
