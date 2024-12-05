import React from 'react';
import { Settings, UserCheck, BookOpen, ClipboardList, BarChart } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Admin Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg shadow-md mb-6">
        <h1 className="text-4xl font-bold mb-2">Welcome, Admin!</h1>
        <p className="text-lg">Manage the platform efficiently and streamline processes with ease.</p>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Admin Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Feature Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <UserCheck className="text-blue-500 w-8 h-8" />
              <h3 className="text-xl font-semibold text-gray-800">Manage Teachers</h3>
            </div>
            <p className="mt-2 text-gray-600">View, add, or update teacher profiles and their associated details.</p>
          </div>

          {/* Feature Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <BookOpen className="text-green-500 w-8 h-8" />
              <h3 className="text-xl font-semibold text-gray-800">Manage Courses</h3>
            </div>
            <p className="mt-2 text-gray-600">Create, update, or delete courses to keep the curriculum updated.</p>
          </div>

          {/* Feature Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <ClipboardList className="text-purple-500 w-8 h-8" />
              <h3 className="text-xl font-semibold text-gray-800">Monitor Reports</h3>
            </div>
            <p className="mt-2 text-gray-600">Access detailed reports and performance analytics for better insights.</p>
          </div>

          {/* Feature Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <BarChart className="text-red-500 w-8 h-8" />
              <h3 className="text-xl font-semibold text-gray-800">View Analytics</h3>
            </div>
            <p className="mt-2 text-gray-600">Analyze data to make informed decisions for the platform.</p>
          </div>

          {/* Feature Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <Settings className="text-yellow-500 w-8 h-8" />
              <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
            </div>
            <p className="mt-2 text-gray-600">Configure platform settings and customize features as needed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
