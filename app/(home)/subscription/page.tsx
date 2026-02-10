"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Plus, Loader2, Trash2 } from "lucide-react";
import { CreateSubscription } from "@/components/subscription/createSubscription";
import { EditSubscription } from "@/components/subscription/editSubscription";
import useCustomQuery from "@/hooks/useCustomQuery";
import useMutate from "@/hooks/useMutate";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponseError } from "@/interfaces/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface Feature {
  feature_name: string;
  feature_value: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing_interval: string;
  description: string;
  features: Feature[];
}
interface PlansResponse {
  count: number;
  next: string | null;
  previous: string | null;
  result: Plan[];
}

interface Invoice {
  id: string;
  organization: string;
  amount: string | number;
  status: string;
  created_at: string;
  due_date: string;
}

interface InvoicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  result: Invoice[];
}

const comparisonData = [
  { feature: "Caregiver", basic: "Up to 10", professional: "Up to 100", enterprise: "Unlimited" },
  { feature: "Clients", basic: "Up to 50", professional: "Up to 200", enterprise: "Unlimited" },
  { feature: "Support", basic: "Email", professional: "Priority", enterprise: "24/7 Phone" },
  { feature: "API Access", basic: "----", professional: "----", enterprise: "----" },
  { feature: "Custom Integrations", basic: "----", professional: "----", enterprise: "----" },
];



export default function SubscriptionsPage() {
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null); // TODO: Update EditSubscription type
  const [activeTab, setActiveTab] = useState("plans");
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const queryClient = useQueryClient();

  const { data: plansData, isLoading } = useCustomQuery<PlansResponse>({
    url: "billing/plans/",
  });

  const { data: invoicesData, isLoading: isLoadingInvoices } = useCustomQuery<InvoicesResponse>({
    url: "billing/invoices/",
  });

  const { mutateAsync: deletePlan, isPending: isDeleting } = useMutate({
    url: "billing/plans/:id/delete/",
    type: "delete",
  });

  const handleEditPlan = (plan: Plan) => {
    // Adapter for EditSubscription until it's updated
    const adaptedPlan = {
      ...plan,
      price: `$ ${plan.price}`,
      period: plan.billing_interval === "monthly" ? "/month" : "/year",
      features: plan.features.map(f => `${f.feature_name}: ${f.feature_value}`)
    };
    setSelectedPlan(adaptedPlan);
    setIsEditPlanOpen(true);
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(undefined, { id: planToDelete.id });
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["billing/plans/"] });
      setPlanToDelete(null);
    } catch (error) {
      const err = error as ApiResponseError;
      toast.error(
        err.response?.data?.message || "Failed to delete plan. Please try again."
      );
    }
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
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
               <Loader2 className="w-8 h-8 animate-spin text-[#590054]" />
             </div>
          ) : !plansData?.result || plansData.result.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-gray-100">
                <Plus className="w-8 h-8 text-[#590054]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Subscription Plans</h3>
              <p className="text-gray-500 max-w-sm mb-8">
                You haven't created any subscription plans yet. Get started by creating your first plan.
              </p>
              <Button 
                className="bg-[#590054] hover:bg-[#590054]/90 text-white rounded-md px-6"
                onClick={() => setIsCreatePlanOpen(true)}
              >
                Create Plan
              </Button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansData?.result?.map((plan, index) => (
              <Card key={plan.id || index} className="p-8 border border-gray-200 shadow-none rounded-lg flex flex-col items-center text-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => setPlanToDelete(plan)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-bold text-[#590054]">$ {plan.price}</span>
                  <span className="text-gray-500 ml-1 text-sm">
                    {plan.billing_interval === "monthly" ? "/month" : "/year"}
                  </span>
                </div>

                <ul className="space-y-4 w-full mb-8 text-left pl-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#590054]" />
                      </span>
                      <span className="text-gray-900 text-sm font-medium">
                        {feature.feature_name}: {feature.feature_value}
                      </span>
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
          )}

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
                  {isLoadingInvoices ? (
                    <>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b last:border-0">
                          {[...Array(7)].map((__, colIndex) => (
                            <td key={colIndex} className="px-6 py-4">
                              <div className="h-4 bg-gray-200 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {invoicesData?.result?.map((invoice, index) => (
                        <tr key={invoice.id || index} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{invoice.organization}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 
                              invoice.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{new Date(invoice.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </td>
                        </tr>
                      ))}
                      {(!invoicesData?.result || invoicesData.result.length === 0) && (
                        <tr>
                          <td colSpan={7}>
                            <div className="h-[360px] flex flex-col items-center justify-center">
                              <Image
                                width={120}
                                height={120}
                                alt="Empty"
                                src="/EmptyNotification.svg"
                                className="opacity-90"
                              />
                              <p className="mt-4 font-medium">No data yet!</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
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

      <AlertDialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the plan
              <span className="font-semibold text-gray-900"> {planToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePlan}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
