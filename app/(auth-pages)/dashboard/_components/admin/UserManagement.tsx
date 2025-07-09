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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  FileText,
  Calendar,
  Phone,
  Briefcase,
  Upload,
  Download,
  FormInput,
  User,
  CreditCard,
  Building,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { User as PrismaUser } from "@/lib/generated/prisma";
import { useState, useMemo } from "react";
import CreateUserForm from "./CreateUserForm";

interface UserManagementProps {
  users: (PrismaUser & {
    uploadedFiles: number;
    formResponses: number;
    filesReceivedFromAdmin: number;
  })[];
  loading: boolean;
  error: string | null;
}

export default function UserManagement({
  users,
  loading,
  error,
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contactNumber?.includes(searchQuery) ||
        user.sinNumber?.includes(searchQuery) ||
        user.businessNumber?.includes(searchQuery)
    );
  }, [users, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg">
        <Loader size={32} className="mb-3 text-emerald-500" />
        <span className="text-base">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg">
        <div className="text-base font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full px-1 sm:px-2 lg:px-3 space-y-6">
      <Card className="bg-emerald-50 border-emerald-200 shadow-xl">
        <CardHeader className="bg-emerald-50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">
                  User Management
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  View and manage all registered users ({users.length} total)
                </CardDescription>
              </div>
            </div>
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={setIsCreateModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg shadow-lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <CreateUserForm onSuccess={() => setIsCreateModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, occupation, phone, SIN, or business number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 text-sm bg-emerald-50 border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-lg"
              />
            </div>
          </div>
        </CardHeader>
        <div className="px-1 sm:px-2 lg:px-3 pb-4 bg-emerald-50">
          <CardContent className="p-0 bg-emerald-50">
            <div className="bg-emerald-50 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-emerald-200">
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-16">
                      User
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-24">
                      Name
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-32">
                      Email
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-20">
                      Phone
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-24">
                      SIN
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-28">
                      Business #
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-20">
                      DOB
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-20">
                      Activity
                    </TableHead>
                    <TableHead className="py-3 px-2 text-emerald-800 font-semibold bg-emerald-100 text-xs w-20">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="py-8 text-center text-gray-500"
                      >
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <div className="text-base">No users found</div>
                        <div className="text-xs">
                          Try adjusting your search criteria
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={`border-emerald-100 hover:bg-emerald-100 transition-colors ${
                          index % 2 === 0 ? "bg-emerald-50" : "bg-white"
                        }`}
                      >
                        <TableCell className="py-3 px-2">
                          <Avatar className="h-8 w-8 ring-2 ring-emerald-100">
                            {user.profileUrl && (
                              <AvatarImage
                                src={user.profileUrl}
                                alt={user.name || user.email}
                                className="object-cover"
                              />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold text-xs">
                              {(user.name || user.email)
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="font-semibold text-gray-900 text-xs truncate max-w-20">
                            {user.name || "No name"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="text-emerald-600 font-medium text-xs truncate max-w-28">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="text-gray-700 text-xs truncate max-w-16">
                            {user.contactNumber || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="text-gray-700 text-xs truncate max-w-20">
                            {user.sinNumber || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="text-gray-700 text-xs truncate max-w-24">
                            {user.businessNumber || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="text-gray-700 text-xs">
                            {user.dateOfBirth
                              ? new Date(user.dateOfBirth).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {user.uploadedFiles > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-1 py-0"
                              >
                                <Upload className="w-2 h-2 text-indigo-500 mr-1" />
                                {user.uploadedFiles}
                              </Badge>
                            )}
                            {user.filesReceivedFromAdmin > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-1 py-0"
                              >
                                <Download className="w-2 h-2 text-emerald-500 mr-1" />
                                {user.filesReceivedFromAdmin}
                              </Badge>
                            )}
                            {user.formResponses > 0 && (
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-1 py-0"
                              >
                                <FormInput className="w-2 h-2 text-purple-500 mr-1" />
                                {user.formResponses}
                              </Badge>
                            )}
                            {user.uploadedFiles === 0 &&
                              user.filesReceivedFromAdmin === 0 &&
                              user.formResponses === 0 && (
                                <span className="text-gray-400 text-xs">
                                  No activity
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="text-gray-600 text-xs">
                            {new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
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

        {/* Pagination */}
        { (
          <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="px-3 py-1 text-xs"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
