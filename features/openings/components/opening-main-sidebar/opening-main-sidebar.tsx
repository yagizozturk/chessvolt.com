import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OpeningMainSidebarProps = {
  title: string;
  subPlayCount: number;
};

export default function OpeningMainSidebar({ title, subPlayCount }: OpeningMainSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subPlayCount} variants</CardDescription>
      </CardHeader>
    </Card>
  );
}
