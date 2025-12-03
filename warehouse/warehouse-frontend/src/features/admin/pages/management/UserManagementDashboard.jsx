import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Users,
  CheckCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@logitrack.com",
      role: "Admin",
      department: "Operations",
      status: "Active",
      lastLogin: "2024-03-10 2:30 PM",
      permissions: "Full Access",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@logitrack.com",
      role: "Manager",
      department: "Logistics",
      status: "Active",
      lastLogin: "2024-03-10 1:15 PM",
      permissions: "Manage Orders, View Reports",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@logitrack.com",
      role: "Operator",
      department: "Warehouse",
      status: "Inactive",
      lastLogin: "2024-03-05 4:20 PM",
      permissions: "View Inventory, Update Stock",
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa.chen@logitrack.com",
      role: "Analyst",
      department: "Analytics",
      status: "Active",
      lastLogin: "2024-03-10 11:45 AM",
      permissions: "View Reports, Export Data",
    },
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-lg font-semibold">User Management</h1>
            <p className="text-gray-500 text-sm">
              Manage team members and access permissions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value="24"
              color="blue"
              icon={<Users />}
            />
            <StatCard
              title="Active Users"
              value="21"
              color="green"
              icon={<CheckCircle />}
            />
            <StatCard
              title="Admins"
              value="3"
              color="purple"
              icon={<DollarSign />}
            />
            <StatCard
              title="Pending Invites"
              value="2"
              color="yellow"
              icon={<AlertTriangle />}
            />
          </div>

          {/* User Table */}
          <div className="bg-white rounded-xl shadow p-5">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full rounded-lg p-2 pl-10 text-sm bg-gray-200 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>

              {/* Role filter */}
              <select className="border rounded-lg p-2 w-full md:w-48 text-sm bg-gray-200 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Operator">Operator</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Department</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Last Login</th>
                    <th className="py-3 px-2">Permissions</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </td>
                      <td className="py-3 px-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-3 px-2">{user.department}</td>
                      <td className="py-3 px-2">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-3 px-2">{user.lastLogin}</td>
                      <td className="py-3 px-2">{user.permissions}</td>
                      <td className="py-3 px-2 flex gap-2">
                        <button className="flex items-center gap-1 text-black border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-100">
                          <Edit2 className="w-4 h-4 text-black" /> Edit
                        </button>
                        <button className="flex items-center gap-1 text-red-600 border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-100">
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Permissions Box */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="mb-3 text-sm text-gray-700">Role Permissions</h2>
            <div className="grid grid-cols-4 gap-4">
              <RolePermissionCard
                title="Admin"
                permissions={[
                  "Full system access",
                  "User management",
                  "System settings",
                  "All reports",
                ]}
              />
              <RolePermissionCard
                title="Manager"
                permissions={[
                  "Manage orders",
                  "View reports",
                  "Customer management",
                  "Inventory oversight",
                ]}
              />
              <RolePermissionCard
                title="Operator"
                permissions={[
                  "Update inventory",
                  "Process shipments",
                  "View orders",
                  "Basic reports",
                ]}
              />
              <RolePermissionCard
                title="Analyst"
                permissions={[
                  "View all reports",
                  "Export data",
                  "Analytics dashboard",
                  "Performance metrics",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- COMPONENTS --- */
const StatCard = ({ title, value, color, icon }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3 text-sm">
      <div
        className={`p-2 rounded-full ${colors[color]} flex items-center justify-center`}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `w-5 h-5 ${colors[color].split(" ")[0]}`,
          })}
      </div>
      <div className="flex flex-col">
        <p className="text-gray-500">{title}</p>
        <h3 className="font-semibold">{value}</h3>
      </div>
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const colors = {
    Admin: "bg-red-100 text-red-600",
    Manager: "bg-blue-100 text-blue-600",
    Operator: "bg-green-100 text-green-600",
    Analyst: "bg-purple-100 text-purple-600",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${colors[role]}`}
    >
      {role}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Active: "bg-green-100 text-green-600",
    Inactive: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const RolePermissionCard = ({ title, permissions }) => (
  <div className="bg-white p-4 rounded-xl shadow text-sm">
    <h3 className="font-medium mb-1">{title}</h3>
    <ul className="list-disc list-inside text-gray-600">
      {permissions.map((perm, idx) => (
        <li key={idx}>{perm}</li>
      ))}
    </ul>
  </div>
);

export default UserManagementDashboard;
