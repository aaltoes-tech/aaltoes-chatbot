"use client"

import { useState } from "react";
import Link from "next/link";
import { Users, ChevronRight, Search } from "lucide-react";
import NavBar from "./NavBar";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
  quota: number | null;
}

export default function AdminContent({ initialUsers }: { initialUsers: User[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = initialUsers.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 my-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">User Management</h1>
            </div>
            
            <div className=" w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-9 bg-gray-50 border border-gray-200 
                           rounded-lg focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {filteredUsers.map((user) => (
              <Link 
                key={user.id}
                href={`/admin/user/${user.id}`}
                className="block border-b border-gray-100 last:border-0"
              >
                <div className="p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {user.image && (
                      <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.name || 'No name'}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {user.role || 'User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Quota: ${user.quota || 0}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quota</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.image && (
                          <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                        )}
                        <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${user.quota || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/user/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1"
                      >
                        Edit
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}