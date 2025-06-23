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
import { Loader } from "@/components/ui/loader";
import { User } from "@/lib/generated/prisma";
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
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Loader size={48} className="mb-2 text-blue-500" />
        Loading users...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage all registered users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Occupation</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Files Uploaded</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.occupation || "N/A"}</TableCell>
                <TableCell>{user.contactNumber || "N/A"}</TableCell>
                <TableCell>{user.uploadedFiles}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
