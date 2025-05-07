import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOwnerPlaygrounds } from "@/lib/actions/playground"
import { PlaygroundsList } from "@/components/owner/playgrounds-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function OwnerPlaygroundsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "OWNER") {
    redirect("/dashboard")
  }

  const playgrounds = await getOwnerPlaygrounds()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Playgrounds</h1>
        <Button asChild>
          <Link href="/owner/playgrounds/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Playground
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Playgrounds</CardTitle>
          <CardDescription>Manage your playgrounds</CardDescription>
        </CardHeader>
        <CardContent>
          <PlaygroundsList playgrounds={playgrounds} />
        </CardContent>
      </Card>
    </div>
  )
}
