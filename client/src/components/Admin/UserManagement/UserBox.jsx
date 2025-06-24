import React, { useState } from "react";
import { FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";

export default function UserBox({
  id,
  name,
  picture = null,
  email,
  class_level,
  user_group,
  user_department,
  mobileNo,
  refreshUsers,
}) {
  const [deleteBoxActive, setDeleteBoxActive] = useState(false);

  function handleDeleteProfile() {
    fetch(`http://localhost:8000/profile/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        refreshUsers();
      })
      .catch((error) => {
        alert(error.message || "An error occurred while deleting the user");
      });
  }

  return (
    <div className="flex bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 w-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center border border-gray-400">
              {picture ? (
                <img
                  src={picture}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl font-bold text-black">{name[0]}</div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-orange-900 truncate">
              {name}
            </h3>
            <p className="text-sm text-orange-600 truncate">{email}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex flex-row gap-4">
            {class_level && (
              <p className="text-orange-800">
                <span className="font-semibold">Class:</span>{" "}
                <span className="text-orange-700">{class_level}</span>
              </p>
            )}
            {user_group && (
              <p className="text-orange-800">
                <span className="font-semibold">Group:</span>{" "}
                <span className="text-orange-700">{user_group}</span>
              </p>
            )}
          </div>

          <p className="text-orange-800">
            <span className="font-semibold">Mobile:</span>{" "}
            {mobileNo || (
              <span className="text-orange-500 italic">Not provided</span>
            )}
          </p>
          {user_department && (
            <p className="text-orange-800">
              <span className="font-semibold">Department:</span>{" "}
              <span className="text-orange-700">{user_department}</span>
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setDeleteBoxActive(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center"
          >
            <FaTrashCan className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteBoxActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 max-w-sm w-full border border-orange-200 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <FaTriangleExclamation className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-orange-900 mb-2">
              Delete Account
            </h3>
            <p className="text-orange-700 text-center mb-6">
              Are you sure you want to permanently delete this user account?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteBoxActive(false)}
                className="px-5 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-md font-medium flex items-center"
              >
                <FaTrashCan className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
