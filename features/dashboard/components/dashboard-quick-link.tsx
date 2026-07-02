"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type DashboardQuickLinkProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export function DashboardQuickLink({ title, description, href, icon }: DashboardQuickLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      href={href}
      onClick={() => setIsLoading(true)}
      aria-busy={isLoading}
      className={cn("group", isLoading && "pointer-events-none")}
    >
      <Card className="group-hover:border-primary/40 relative h-full transition-colors">
        {isLoading ? (
          <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center rounded-xl">
            <Spinner className="size-8" />
          </div>
        ) : null}
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Image src={icon} alt="" aria-hidden width={32} height={32} className="size-8 shrink-0" />
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </CardHeader>
      </Card>
    </Link>
  );
}
