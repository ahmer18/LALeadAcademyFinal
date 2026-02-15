import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaImage, FaLock, FaMailBulk, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
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

  const { userSignup, setUser, updateUserProfile, isUserLoading } = useAuth();

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
    toast.success("Signup successful!");
    navigate(location.state?.from || "/");
  } catch (err) {
    console.error("MongoDB Save Error:", err);
    toast.error("Account created, but database sync failed.");
  }
},
});    
  
  const handleSubmitForm = (data) => {
    if (signupMutation.isPending) return;
    signupMutation.mutate(data);
  };

  if (isUserLoading) return <LoaderDotted />;

  return (
    <>
      <HeadTag title="LA Lead Academy | Signup" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create an account
          </h2>

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
      className="w-full outline-none text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
  </div>
  {errors.image && (
    <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
  )}
</div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
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
              className="text-indigo-600 hover:underline font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
