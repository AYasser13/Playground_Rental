import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllPlaygrounds } from "@/lib/actions/playground"
import { AdminPlaygroundsList } from "@/components/admin/admin-playgrounds-list"

export default async function AdminPlaygroundsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const playgrounds = await getAllPlaygrounds()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Playground Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Playgrounds</CardTitle>
          <CardDescription>Manage all playgrounds in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminPlaygroundsList playgrounds={playgrounds} />
        </CardContent>
      </Card>
    </div>
  )
}
