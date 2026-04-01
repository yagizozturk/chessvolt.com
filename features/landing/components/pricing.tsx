"use client";

import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "To discover basic features and start learning.",
      features: [
        "Access to all basic lessons",
        "Core puzzles and lessons",
        "Leaderboard participation",
        "Standard achievement badges",
      ],
      buttonText: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Volt Member",
      price: "99",
      description: "Legendary features for those who want to learn without stopping.",
      features: [
        "Full access to all lessons and modes",
        "Ad-free experience",
        "Volt exclusive achievement badges",
        "Personalized error analysis",
        "Priority support",
      ],
      buttonText: "Upgrade to Volt",
      variant: "default" as const,
      popular: true,
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Choose the Plan That Fits You
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            Continue for free or double your learning speed with Volt Member.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl items-stretch gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col transition-all duration-300 ${
                plan.popular
                  ? "border-primary bg-primary/[0.01] shadow-2xl lg:scale-105"
                  : "border-border shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-secondary absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 text-sm font-bold shadow-lg">
                  <Zap className="h-3 w-3 fill-current" /> MOST POPULAR
                </div>
              )}

              <CardHeader className="pt-8 text-center">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold">₺{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <CardDescription className="mt-2 min-h-[40px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-4">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={`mt-0.5 shrink-0 rounded-full p-0.5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <Check className="h-4 w-4 stroke-[3px]" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6 pb-8">
                <Button
                  className={`h-12 w-full text-base font-bold transition-all ${
                    plan.popular
                      ? "shadow-primary/20 hover:bg-primary/90 shadow-lg"
                      : ""
                  }`}
                  variant={plan.variant}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

{
  /** Notes:
   * 1. Check Fix: Used "Check" icon from Lucide-React instead of npx-installed "check".
   * 2. Volt Member Emphasis: Premium plan highlighted with "MOST POPULAR" label and scale-105.
   * 3. Design Consistency: Border, shadow and padding balanced with Shadcn Card structure.
   * 4. Responsive Grid: Single column on mobile, two columns side-by-side on medium and large screens.
   */
}
