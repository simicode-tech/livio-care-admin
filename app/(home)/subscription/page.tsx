"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus } from "lucide-react";
import { CreateSubscription } from "@/components/subscription/createSubscription";
import { EditSubscription } from "@/components/subscription/editSubscription";

const plans = [
  {
    name: "Basic",
    price: "$ 299",
    period: "/month",
    features: [
      "Up to 10 caregivers",
      "Shift Scheduling",
      "Basic care planning",
      "Email Support Only",
    ],
  },
  {
    name: "Professional",
    price: "$ 299",
    period: "/month",
    features: [
      "Up to 10 caregivers",
      "Shift Scheduling",
      "Basic care planning",
      "Email Support Only",
    ],
  },
  {
    name: "Enterprise",
    price: "$ 299",
    period: "/month",
    features: [
      "Up to 10 caregivers",
      "Shift Scheduling",
      "Basic care planning",
      "Email Support Only",
    ],
  },
];

const comparisonData = [
  { feature: "Caregiver", basic: "Up to 10", professional: "Up to 100", enterprise: "Unlimited" },
  { feature: "Clients", basic: "Up to 50", professional: "Up to 200", enterprise: "Unlimited" },
  { feature: "Support", basic: "Email", professional: "Priority", enterprise: "24/7 Phone" },
  { feature: "API Access", basic: "----", professional: "----", enterprise: "----" },
  { feature: "Custom Integrations", basic: "----", professional: "----", enterprise: "----" },
];

const invoices = [
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
  { id: "INV-2025-001", organization: "Caring Hearts Agency", amount: "$299.00", status: "Paid", date: "Oct 18, 2025", dueDate: "Oct 18, 2025" },
];

export default function SubscriptionsPage() {
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [activeTab, setActiveTab] = useState("plans");

  const handleEditPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsEditPlanOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 md:px-12  min-h-screen">
      <Tabs defaultValue="plans" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b">
          <TabsList className="bg-transparent h-auto p-0 justify-start w-auto rounded-none">
            <TabsTrigger
              value="plans"
              className="border-0 rounded-none data-[state=active]:border-b-2  data-[state=active]:border-[#590054] data-[state=active]:text-[#590054] data-[state=active]:shadow-none px-4 py-3 text-base font-bold text-gray-500 "
            >
              Plans
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="border-0 rounded-none data-[state=active]:border-b-2  data-[state=active]:border-[#590054] data-[state=active]:text-[#590054] data-[state=active]:shadow-none px-4 py-3 text-base font-bold text-gray-500 "
            >
              Invoices
            </TabsTrigger>
          </TabsList>
          <div className="pb-2 md:pb-0">
            <Button 
              className="bg-[#590054] hover:bg-[#590054]/90 text-white rounded-md px-6"
              onClick={() => activeTab === "plans" ? setIsCreatePlanOpen(true) : null}
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === "plans" ? "Create Plan" : "Create Invoice"}
            </Button>
          </div>
        </div>

        <TabsContent value="plans" className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className="p-8 border border-gray-200 shadow-none rounded-lg flex flex-col items-center text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold text-[#590054]">{plan.price}</span>
                  <span className="text-gray-500 ml-1 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-4 w-full mb-8 text-left pl-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#590054]" />
                      </span>
                      <span className="text-gray-900 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full border-[#590054] text-[#590054] hover:bg-purple-50 mt-auto py-5 font-bold"
                  onClick={() => handleEditPlan(plan)}
                > 
                  Edit plan
                </Button>
              </Card>
            ))}
          </div>

          <div className="border rounded-xl p-8 bg-white">
            <h3 className="text-lg font-bold mb-8 text-gray-900">Plan Comparison</h3>
            
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-4 gap-4 mb-6 text-sm font-medium text-gray-900 border-b pb-4">
                  <div className="text-gray-900 font-bold">Feature</div>
                  <div>Basic</div>
                  <div>Professional</div>
                  <div>Enterprise</div>
                </div>
                <div className="space-y-6">
                  {comparisonData.map((row, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 last:border-0 text-sm">
                      <div className="font-medium text-gray-900">{row.feature}</div>
                      <div className="text-gray-900">{row.basic}</div>
                      <div className="text-gray-900">{row.professional}</div>
                      <div className="text-gray-900">{row.enterprise}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="border rounded-xl bg-white overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">All Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Invoice ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Organization</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Due Date</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.organization}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.dueDate}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" className="text-[#590054] hover:text-[#590054]/80 hover:bg-purple-50 font-medium text-xs h-auto py-1 px-3">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CreateSubscription 
        open={isCreatePlanOpen} 
        onOpenChange={setIsCreatePlanOpen} 
      />  
      <EditSubscription 
        open={isEditPlanOpen} 
        onOpenChange={setIsEditPlanOpen} 
        plan={selectedPlan}
      />
    </div>
  );
}