import React, { useState } from "react";
import { Github, Linkedin, Mail, UploadCloud, X } from "lucide-react";
import { motion } from "framer-motion";
import { userAuthService } from "../../service/userAuth";
import { toast } from "react-toastify";

type Props = {
  userInfo: {
    username: string;
    email: string;
    createdAt: string;
    firstName?: string;
    lastName?: string;
    github?: string;
    linkedin?: string;
    profileImage?: string;
  };
  onClose: () => void;
  onProfileUpdate: (updatedUser: any) => void;
};

const ProfileEditModal: React.FC<Props> = ({ userInfo, onClose, onProfileUpdate }) => {
  console.log("from profileedit modal componrt",userInfo)
  const [loading, setLoading] = useState(false);
  const [github, setGithub] = useState(userInfo.github || "");
  const [linkedin, setLinkedin] = useState(userInfo.linkedin || "");
  const [image, setImage] = useState<File | null>(null);
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("github", github);
    formData.append("linkedin", linkedin);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);

    try {
      const response = await userAuthService.updateProfile(formData);

      if (response.success && response.user) {
        toast.success("Profile updated successfully!");
        onProfileUpdate(response.user); 
        onClose();
      } else {
        toast.error(response.message || "Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1F2937] text-white rounded-3xl p-8 w-[700px] relative shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold text-white text-center mb-8">Edit Profile</h2>

        <div className="flex justify-center mb-8">
          <label className="cursor-pointer relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UploadCloud className="w-6 h-6 text-white" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-white mb-1 block">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            />
          </div>
          <div>
            <label className="text-sm text-white mb-1 block">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            />
          </div>
          <div>
            <label className="text-sm text-white mb-1 block">Github</label>
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            />
          </div>
          <div>
            <label className="text-sm text-white mb-1 block">LinkedIn</label>
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/..."
              className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-white mb-1 block">Email</label>
            <div className="flex items-center space-x-2 bg-slate-700 p-2 rounded">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">{userInfo.email}</span>
            </div>
            <p className="text-xs text-rose-400 mt-1">⚠️ You can't change your email.</p>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button className="bg-slate-500 hover:bg-slate-600 text-white py-1 px-4 rounded">
            Change Password
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileEditModal;
