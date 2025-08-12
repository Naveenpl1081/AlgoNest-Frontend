import React, { useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Github,
  Linkedin,
} from "lucide-react";
import ProfileEditModal from "./ProfileEditModal";
import { Buildimage } from "../../utils/cloudinary/cloudinary";

type UserInfo = {
  username: string;
  email: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  github?: string;
  linkedin?: string;
  profileImage?: string;
};

type Props = {
  userInfo: UserInfo;
};

const UserDetails: React.FC<Props> = ({ userInfo }) => {
  console.log("userInfo from userDetailscomponent",userInfo)
  const [showModal, setShowModal] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(userInfo);

  const fullName = updatedInfo.firstName || updatedInfo.lastName
    ? `${updatedInfo.firstName ?? ""} ${updatedInfo.lastName ?? ""}`.trim()
    : updatedInfo.username;

  return (
    <>
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-28 h-28 rounded-full mx-auto mb-4 shadow-2xl overflow-hidden border-4 border-gradient-to-br from-cyan-500 via-blue-500 to-purple-500">
            {updatedInfo.profileImage ? (
              <img
                src={Buildimage(updatedInfo.profileImage)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 w-full h-full flex items-center justify-center">
                <User className="w-14 h-14 text-white" />
              </div>
            )}
          </div>

          <div className="text-center mb-2">
            <div className="flex items-center justify-center space-x-2">
              <h1 className="text-xl font-bold text-white">{fullName}</h1>
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-1">@{updatedInfo.username}</p>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 text-sm rounded-full font-semibold">
              Rank #247
            </div>
          </div>
        </div>

        <div className="space-y-4 text-gray-300">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">{updatedInfo.email}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">
              Joined{" "}
              {new Date(updatedInfo.createdAt)
                .toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                .replace(",", "")
                .split(" ")
                .join("-")}
            </span>
          </div>

          {updatedInfo.github && (
            <div className="flex items-center space-x-3">
              <Github className="w-4 h-4 text-cyan-400" />
              <a
                href={updatedInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline text-blue-400"
              >
                GitHub Profile
              </a>
            </div>
          )}

          {updatedInfo.linkedin && (
            <div className="flex items-center space-x-3">
              <Linkedin className="w-4 h-4 text-cyan-400" />
              <a
                href={updatedInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline text-blue-400"
              >
                LinkedIn Profile
              </a>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-slate-700/30 backdrop-blur-md hover:bg-slate-700/50 text-white font-semibold rounded-xl transition-all border border-white/10 shadow-xl hover:shadow-2xl"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProfileEditModal
          userInfo={updatedInfo}
          onClose={() => setShowModal(false)}
          onProfileUpdate={(newData) => setUpdatedInfo(newData)}
        />
      )}
    </>
  );
};

export default UserDetails;
