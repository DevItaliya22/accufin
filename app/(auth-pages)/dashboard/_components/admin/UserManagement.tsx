import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import {
  Search,
  Users,
  FileText,
  Calendar,
  Phone,
  Briefcase,
} from "lucide-react";
import { User } from "@/lib/generated/prisma";
import { useState, useMemo } from "react";
interface UserManagementProps {
  users: (User & { uploadedFiles: number })[];
  loading: boolean;
  error: string | null;
}

export default function UserManagement({
  users,
  loading,
  error,
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contactNumber?.includes(searchQuery)
    );
  }, [users, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg">
        <Loader size={48} className="mb-4 text-emerald-500" />
        <span className="text-lg">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
        <div className="text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  User Management
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage all registered users ({users.length} total)
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name, email, occupation, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 text-lg bg-white border-gray-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-lg"
              />
            </div>
          </div>
        </CardHeader>
        <div className=" p-6 bg-white">
        <CardContent className="p-0 bg-gray-50">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 p-6 ">
                  <TableHead className="py-4 text-gray-700 font-semibold bg-slate-100">
                    User
                  </TableHead>
                  <TableHead className="py-4 text-gray-700 font-semibold bg-slate-100">
                    Contact Info
                  </TableHead>
                  <TableHead className="py-4 text-gray-700 font-semibold bg-slate-100">
                    Occupation
                  </TableHead>
                  <TableHead className="py-4 text-gray-700 font-semibold bg-slate-100">
                    Activity
                  </TableHead>
                  <TableHead className="py-4 text-gray-700 font-semibold bg-slate-100">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow className="p-6">
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-gray-500"
                    >
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <div className="text-lg">No users found</div>
                      <div className="text-sm">
                        Try adjusting your search criteria
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={`border-gray-100 hover:bg-emerald-25 transition-colors ${
                        index % 2 === 0 ? "bg-slate-25" : "bg-white"
                      }`}
                    >
                      <TableCell className="py-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-14 w-14 ring-2 ring-emerald-100">
                            {user.profileUrl && (
                              <AvatarImage
                                src={user.profileUrl}
                                alt={user.name || user.email}
                                className="object-cover"
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold text-lg">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : user.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">
                              {user.name || "No name provided"}
                            </div>
                            <div className="text-emerald-600 font-medium">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="space-y-2">
                          {user.contactNumber ? (
                            <div className="flex items-center space-x-2 text-gray-700">
                              <Phone className="w-4 h-4 text-emerald-500" />
                              <span>{user.contactNumber}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Not provided
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        {user.occupation ? (
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4 text-amber-500" />
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 border-amber-200"
                            >
                              {user.occupation}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Not specified
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 border-indigo-200 text-md"
                          >
                          <FileText className="w-4 h-4 text-indigo-500" />
                            {user.uploadedFiles} files
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        </div>
      
      </Card>
    </div>
  );
}
