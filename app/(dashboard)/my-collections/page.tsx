import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getMyCustomCollections } from "@/features/collection/services/collection.service";
import { getAuthenticatedUser } from "@/lib/supabase/auth";
import {
  createMyCollectionAction,
  deleteMyCollectionAction,
  updateMyCollectionAction,
} from "./actions";

export default async function MyCollectionsPage() {
  const { user, supabase } = await getAuthenticatedUser();
  const collections = await getMyCustomCollections(supabase, user.id);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-6 pb-16">
      <div className="mt-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Collection</CardTitle>
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

        <div className="space-y-4">
          <h1 className="text-2xl font-bold tracking-tight">My Collections</h1>
          {collections.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              You don&apos;t have any collections yet. Create your first one above.
            </p>
          ) : (
            collections.map((collection) => (
              <Card key={collection.id}>
                <CardContent className="pt-6">
                  <form action={updateMyCollectionAction} className="space-y-3">
                    <input type="hidden" name="id" value={collection.id} />
                    <Input
                      name="title"
                      defaultValue={collection.title}
                      placeholder="Collection name"
                      required
                    />
                    <Textarea
                      name="description"
                      defaultValue={collection.description ?? ""}
                      placeholder="Description (optional)"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="volt" type="submit">
                        Save
                      </Button>
                    </div>
                  </form>
                  <form action={deleteMyCollectionAction} className="mt-2">
                    <input type="hidden" name="id" value={collection.id} />
                    <Button type="submit" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
