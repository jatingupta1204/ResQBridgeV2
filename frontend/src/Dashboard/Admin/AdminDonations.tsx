// src/Dashboard/Admin/AdminDonations.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Donation {
  id: number;
  donor: string;
  amount: string;
  date: string;
}

const sampleDonations: Donation[] = [
  { id: 1, donor: "John D.", amount: "$250", date: "2 days ago" },
  { id: 2, donor: "Anonymous", amount: "$100", date: "3 days ago" },
  { id: 3, donor: "Sarah M.", amount: "$500", date: "1 week ago" },
];

export default function AdminDonations() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Donations</h1>
      {sampleDonations.map((donation) => (
        <Card key={donation.id} className="p-4 bg-white rounded-lg shadow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">{donation.donor}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Amount: {donation.amount}</p>
            <p className="text-sm text-gray-600">Date: {donation.date}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
