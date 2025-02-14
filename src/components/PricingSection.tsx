
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      features: ["50 generations/month", "Standard quality", "24h support"],
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      features: [
        "200 generations/month",
        "High quality",
        "Priority support",
        "Custom sizes",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      features: [
        "Unlimited generations",
        "Maximum quality",
        "24/7 priority support",
        "API access",
        "Custom solutions",
      ],
      popular: false,
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the perfect plan for your creative needs
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 ${
                plan.popular
                  ? "ring-2 ring-primary"
                  : "ring-1 ring-muted"
              } rounded-3xl`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-medium tracking-wide text-primary-foreground bg-primary rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-semibold leading-8">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>
              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8" variant={plan.popular ? "default" : "outline"}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
