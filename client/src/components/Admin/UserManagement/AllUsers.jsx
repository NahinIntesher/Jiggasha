"use client";
import React, { useEffect, useState } from "react";
import UserBox from "./UserBox";
import NotFound from "../../ui/NotFound";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

export default function AllUsers({ userData }) {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { value } = e.target;
    const filteredUsers = userData.filter((user) =>
      user.full_name.toLowerCase().includes(value.toLowerCase())
    );
    setUsers(filteredUsers);
    setSearchText(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-3">
        <div className="animate-spin text-orange-500">
          <FaSyncAlt size={24} />
        </div>
        <div className="text-lg text-orange-700 font-medium">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-md font-medium flex items-center"
        >
          <FaSyncAlt className="mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-100 p-2 rounded-full">
            <FaUsers className="text-orange-600 text-lg" />
          </div>
          <p className="text-lg font-bold text-orange-900">
            Manage all registered users in the system
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-orange-400" />
          </div>
          <input
            name="search"
            onChange={handleInputChange}
            value={searchText}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50 placeholder-orange-300 text-orange-800"
          />
        </div>
        <div className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
          {users.length} {users.length === 1 ? "user" : "users"} found
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <UserBox
              key={user.user_id}
              id={user.user_id}
              name={user.full_name}
              email={user.email}
              picture={user.user_picture}
              mobileNo={user.mobile_no}
              class_level={user.user_class_level}
              user_group={user.user_group}
              user_department={user.user_department}
              refreshUsers={fetchUsers}
            />
          ))
        ) : (
          <div className="col-span-full py-12">
            <NotFound
              message="No users found"
              description={
                searchText
                  ? `No matches for "${searchText}"`
                  : "Try adjusting your search"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
