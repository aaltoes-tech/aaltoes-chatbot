"use client"

import Link from "next/link";
import { User, Search } from "lucide-react";
import { useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    quota: number;
}

export default function AdminPage({ users }: { users: User[] }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="mx-auto my-10 max-w-6xl px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage users and their permissions</p>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 
                                 rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">User</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Email</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Role</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Quota</th>
                                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">${user.quota.toFixed(5)}</td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            href={`/admin/user/${user.id}`}
                                            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}  
