'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Customer } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  nic: z.string().min(5, "NIC must be at least 5 characters."),
  contact: z.string().min(5, "Contact information is required."),
  orderHistory: z.string().optional(),
  preferences: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
    customer?: Customer;
    onSave?: () => void;
}

export function CustomerForm({ customer, onSave }: CustomerFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [customers, setCustomers] = useLocalStorage<Customer[]>("customers", []);
  const isEditMode = !!customer;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode && customer ? {
        name: customer.name,
        nic: customer.nic,
        contact: customer.contact,
        orderHistory: customer.orderHistory,
        preferences: customer.preferences,
    } : {
        name: "",
        nic: "",
        contact: "",
        orderHistory: "",
        preferences: "",
    },
  });

  function onSubmit(data: CustomerFormValues) {
    if (isEditMode && customer) {
      const updatedCustomer: Customer = {
        ...customer,
        ...data
      };
      setCustomers(customers.map((c) => (c.id === customer.id ? updatedCustomer : c)));
      toast({
        title: "Customer Updated!",
        description: `${data.name}'s profile has been successfully updated.`,
      });
      if(onSave) onSave();
    } else {
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
        measurementSets: [],
      };
      setCustomers([...customers, newCustomer]);
      toast({
        title: "Customer Added!",
        description: `${data.name} has been successfully added to your records.`,
      });
      router.push(`/dashboard/customer/${newCustomer.id}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIC Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123456789V" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Contact Info (Phone/Email)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 0771234567 or jane@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Style Profile</CardTitle>
            <CardDescription>This information helps the AI recommender. (Optional)</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="orderHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 2 slim-fit shirts, 1 pair of trousers" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style Preferences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Prefers classic colors, comfortable fit, natural fabrics." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit" size="lg">
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Save Changes" : "Create Customer"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
