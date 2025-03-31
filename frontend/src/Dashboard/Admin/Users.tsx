import { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser, createUser } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Editing state for an existing user
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editRole, setEditRole] = useState<string>("");

  // New user state
  const [addingNewUser, setAddingNewUser] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("admin");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");
      const data = await getUsers(token);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditName("");
    setEditEmail("");
    setEditRole("");
  };

  const handleSaveEdit = async (userId: number) => {
    try {
      const response = await updateUser(userId, { name: editName, email: editEmail, role: editRole });
      if (response.error) {
        alert(response.error);
      } else {
        alert("User updated successfully");
        await loadUsers();
        handleCancelEdit();
      }
    } catch (err: any) {
      alert(err.message || "Error updating user");
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await deleteUser(userId);
        if (response.error) {
          alert(response.error);
        } else {
          alert("User deleted successfully");
          await loadUsers();
        }
      } catch (err: any) {
        alert(err.message || "Error deleting user");
      }
    }
  };

  // Reset new user form values
  const resetNewUserForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setNewRole("admin");
  };

  // Called when canceling or closing the add user modal
  const handleCancelAddUser = () => {
    resetNewUserForm();
    setAddingNewUser(false);
  };

  const handleAddUser = async () => {
    if (!newName || !newEmail || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const response = await createUser(
        {
          name: newName,
          email: newEmail,
          role: newRole,
          password: newPassword,
        },
        token
      );

      if (response.error) {
        alert(response.error);
      } else {
        alert("User created successfully");
        await loadUsers();
        resetNewUserForm();
        setAddingNewUser(false);
      }
    } catch (err: any) {
      alert(err.message || "Error creating user");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="space-y-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <Button onClick={() => setAddingNewUser(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          Add New User
        </Button>
      </div>

      {/* Modal for adding new user */}
      {addingNewUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-xl max-w-lg w-full transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-2xl font-semibold text-gray-800">Add New User</h2>
              <button onClick={handleCancelAddUser} className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none">
                &times;
              </button>
            </div>
            <div className="space-y-5">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                type="password"
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300 transition"
              >
                <option value="admin">Admin</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700 text-white">
                Add User
              </Button>
              <Button onClick={handleCancelAddUser} variant="outline" className="text-gray-700">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Role</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingUserId === user.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{user.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingUserId === user.id ? (
                    <Input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      type="email"
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{user.email}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {editingUserId === user.id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:border-blue-300 transition"
                    >
                      <option value="admin">Admin</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900">{user.role}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border-r">
                  {editingUserId === user.id ? (
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={() => handleSaveEdit(user.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="text-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3">
                      <Button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
