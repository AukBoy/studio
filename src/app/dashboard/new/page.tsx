import { CustomerForm } from '@/components/customer-form';
import { UserPlus } from 'lucide-react';

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <UserPlus className="h-8 w-8 text-primary" />
        <div>
            <h1 className="text-3xl lg:text-4xl font-headline font-bold">New Customer Profile</h1>
            <p className="text-muted-foreground mt-1">Add a new customer and their measurements to the system.</p>
        </div>
      </div>
      <CustomerForm />
    </div>
  );
}
