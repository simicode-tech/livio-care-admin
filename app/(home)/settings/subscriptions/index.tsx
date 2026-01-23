"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard, Download, RotateCcw } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "per month",
    description: "Perfect for small teams and startups",
    features: [
      "Up to 10 team members",
      "Basic reporting",
      "Client management",
      "Schedule management",
    ],
    current: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Best for growing organizations",
    features: [
      "Up to 50 team members",
      "Advanced reporting",
      "Client management",
      "Schedule management",
      "Custom branding",
      "API access",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "per month",
    description: "For large scale operations",
    features: [
      "Unlimited team members",
      "Advanced reporting",
      "Client management",
      "Schedule management",
      "Custom branding",
      "API access",
      "24/7 support",
      "Custom integrations",
    ],
    current: false,
  },
];

const billingHistory = [
  {
    date: "Mar 1, 2024",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2024-001",
  },
  {
    date: "Feb 1, 2024",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2024-002",
  },
  {
    date: "Jan 1, 2024",
    amount: "$99.00",
    status: "Paid",
    invoice: "INV-2024-003",
  },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Subscription Plans</h2>
        <p className="text-sm text-gray-500">Manage your subscription and billing details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={`p-6 ${plan.current ? 'border-primary' : ''}`}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm"> {plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className={plan.current ? 'w-full bg-gray-100 text-gray-600' : 'w-full bg-primary'} 
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium">Payment Method</h3>
            <p className="text-sm text-gray-500">Manage your payment method and billing cycle</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Update Payment Method
          </Button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <CreditCard className="w-6 h-6 text-gray-400" />
          <div>
            <p className="font-medium">Visa ending in 4242</p>
            <p className="text-sm text-gray-500">Expires 12/24</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="font-medium">Billing History</h3>
            <p className="text-sm text-gray-500">View and download your billing history</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="text-sm text-gray-500 border-b">
              <tr>
              <th className="text-left pb-4">Date</th>
              <th className="text-left pb-4">Amount</th>
              <th className="text-left pb-4">Status</th>
              <th className="text-left pb-4">Invoice</th>
              <th className="text-right pb-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {billingHistory.map((item, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="py-4">{item.date}</td>
                <td className="py-4">{item.amount}</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                    {item.status}
                  </span>
                </td>
                <td className="py-4">{item.invoice}</td>
                <td className="py-4 text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}