import { redirect } from "next/navigation"

export default function PlaygroundDetailRedirect({ params }: { params: { id: string } }) {
  // Redirect to the edit page
  redirect(`/owner/playgrounds/${params.id}/edit`)
}
