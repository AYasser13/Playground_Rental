import { Badge } from "@/components/ui/badge"
import type { User } from "@/types"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RecentUsersProps {
  users: User[]
}

export function RecentUsers({ users }: RecentUsersProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex flex-col space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{user.name}</h3>
            <Badge variant="outline">{user.role}</Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{user.email}</p>
            <p className="mt-1">Joined: {formatDate(user.createdAt)}</p>
          </div>
        </div>
      ))}

      {users.length > 0 && (
        <Button variant="outline" className="w-full" asChild>
          <Link href="/admin/users">View All Users</Link>
        </Button>
      )}
    </div>
  )
}
