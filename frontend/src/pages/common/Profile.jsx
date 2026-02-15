import { useState } from "react"; // Add this
import { FaCamera, FaEnvelope, FaPhone, FaUser, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import HeadTag from "../../components/common/HeadTag";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Add this
import handleUpload from "../../utils/ImageUploadApi"; // Add this

export default function UserProfile() {
  const { user, updateUserProfile, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);

  if (!user) return <p>Loading...</p>;

  // Handle Image Change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      // 1. Upload to imgbb
      const newPhotoURL = await handleUpload(file);

      if (newPhotoURL) {
        // 2. Update Firebase
        await updateUserProfile(user.displayName, newPhotoURL);
        
        // 3. Update MongoDB using the new route we created
        await axiosSecure.patch("/users/update-profile", {
          email: user.email,
          displayName: user.displayName,
          photoURL: newPhotoURL,
        });

        // 4. Update Local State so UI changes instantly
        setUser({ ...user, photoURL: newPhotoURL });
        toast.success("Profile picture updated!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update image");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <>
      <HeadTag title="LA Lead Academy | Profile" />
      <div className="h-full py-4 px-2 md:p-10">
        <div className="flex flex-col items-center gap-4 w-full md:max-w-2xl mx-auto">
          
          {/* Profile Image with Edit Button */}
          <div className="relative group">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className={`w-32 h-32 rounded-full object-cover border-4 ${uploading ? 'border-gray-300 opacity-50' : 'border-blue-500'}`}
            />
            <label className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
              <FaCamera className="text-white text-sm" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
                disabled={uploading}
              />
            </label>
            {uploading && <p className="text-xs text-blue-600 font-bold mt-2 text-center absolute -bottom-6 w-full">Uploading...</p>}
          </div>

          <h2 className="text-2xl font-bold mt-4">User Profile</h2>

          <div className="w-full mt-2 space-y-3">
            <div className="flex items-center gap-3 mx-4 md:mx-10 my-5 px-4 py-4 rounded bg-gray-100 shadow-lg">
              <FaUser className="text-blue-600" />
              <p>
                <span className="font-semibold">Name:</span>{" "}
{user?.displayName || user?.name || "Loading..."}              </p>
            </div>
            {/* ... other fields (Role, Email, Phone) stay the same ... */}
            <div className="flex items-center gap-3 mx-4 md:mx-10 my-5 px-4 py-4 rounded bg-gray-100 shadow-lg">
              <FaUserShield className="text-green-600" />
              <p className="capitalize">
                <span className="font-semibold">Role:</span> {user.role || "student"}
              </p>
            </div>
            <div className="flex items-center gap-3 mx-4 md:mx-10 my-5 px-4 py-4 rounded bg-gray-100 shadow-lg">
              <FaEnvelope className="text-red-600" />
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}