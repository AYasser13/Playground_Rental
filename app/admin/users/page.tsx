import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllUsers } from "@/lib/actions/user"
import { UsersList } from "@/components/admin/users-list"

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const users = await getAllUsers()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersList users={users} />
        </CardContent>
      </Card>
    </div>
  )
}
