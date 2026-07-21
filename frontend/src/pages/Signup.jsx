import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaImage, FaLock, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useFeedback } from "../providers/FeedbackProvider";
import handleUpload from "../utils/ImageUploadApi";

const errorMap = {
  "auth/invalid-email": "Invalid email address.",
  "auth/email-already-in-use": "Email already in use.",
  "auth/weak-password": "Password should be at least 6 characters long.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
};

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();

  const { user, userSignup, setUser, updateUserProfile, isUserLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      // 1. Upload to imgbb
      const imageFile = data.image[0];
      const uploadedUrl = await handleUpload(imageFile);
      if (!uploadedUrl) throw new Error("Image upload failed.");

      // 2. Create Firebase User
      const userCredential = await userSignup(data.email, data.password);

      // 3. Update Firebase Profile 
      // IMPORTANT: Only pass name and url. Do NOT pass userCredential.user here.
      await updateUserProfile(data.name, uploadedUrl);

      // 4. Reload to get fresh data
      await userCredential.user.reload();

      return {
        uid: userCredential.user.uid,
        email: data.email,
        displayName: data.name,
        photoURL: uploadedUrl
      };
    },
    onSuccess: async (data) => {
      // 'data' here is exactly what you returned from mutationFn:
      // { uid, email, displayName, photoURL }

      try {
        // 5. Save user in MongoDB
        await axiosSecure.post(`/users`, {
          email: data.email,
          photoURL: data.photoURL,
          displayName: data.displayName,
        });

        // 6. Update local Auth state
        setUser({
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          role: "student"
        });

        reset();
        showFeedback("Signup successful!", "success");
        navigate(location.state?.from || "/dashboard");
      } catch (err) {
        console.error("MongoDB Save Error:", err);
        showFeedback("Account created, but database sync failed.", "error");
      }
    },
  });

  const handleSubmitForm = (data) => {
    if (signupMutation.isPending) return;
    signupMutation.mutate(data);
  };

  if (isUserLoading) return <LoaderDotted />;
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <HeadTag title="LA Lead Academy | Signup" />
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f] relative overflow-hidden px-4 py-12">
        {/* Subtle Brand Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8d6e3e] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900 rounded-full blur-[150px] opacity-10" />

        <div className="bg-white shadow-2xl rounded-[2.5rem] p-10 w-full max-w-md relative z-10 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="brand-text text-4xl mb-2 text-gray-900">
              LALEAD Academy
            </h1>
            <p className="text-gray-500 font-medium italic">Create Your Account</p>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter your name"
                  className="w-full outline-none"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <FaMailBulk className="text-gray-400 mr-2" />
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
              <div className="flex items-center border rounded-md px-3 py-2">
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

            {/* Profile Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <FaImage className="text-gray-400 mr-2" />
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: "Image is required" })}
                  className="w-full outline-none text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#8d6e3e]/10 file:text-[#8d6e3e] hover:file:bg-[#8d6e3e]/20 cursor-pointer"
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-[#8d6e3e] text-white py-3 rounded-xl hover:bg-[#725a32] transition-all duration-300 font-black text-lg shadow-lg shadow-[#8d6e3e]/20"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8d6e3e] hover:underline font-bold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
