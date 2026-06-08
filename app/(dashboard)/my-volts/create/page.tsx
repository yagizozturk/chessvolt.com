import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createMyCollectionAction } from "@/app/(dashboard)/my-volts/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateMyCollectionPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 pt-6 pb-16">
      <Link
        href="/my-volts"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        My collections
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create collection</CardTitle>
          <CardDescription>Add a new collection to organize your riddles.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createMyCollectionAction} className="space-y-3">
            <Input name="title" placeholder="Collection name" required />
            <Textarea name="description" placeholder="Description (optional)" rows={3} />
            <Button variant="volt" type="submit">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
