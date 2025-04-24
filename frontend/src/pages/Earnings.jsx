import React from "react";
import { DollarSign, TrendingUp, Wallet, CheckCircle } from "lucide-react";

const Earnings = () => {
  // Sample Earnings Data
  const earningsData = {
    totalEarnings: "$2,450.00",
    pendingPayments: "$320.00",
    lastPaymentDate: "March 10, 2025",
    transactions: [
      { id: 1, amount: "$500.00", date: "March 1, 2025", status: "Completed" },
      { id: 2, amount: "$620.00", date: "March 5, 2025", status: "Completed" },
      { id: 3, amount: "$320.00", date: "March 12, 2025", status: "Pending" },
      { id: 4, amount: "$420.00", date: "March 15, 2025", status: "Completed" },
    ],
  };

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-white flex items-center gap-2">
        <DollarSign className="w-7 h-7 text-yellow-400" /> Earnings Overview
      </h1>
      <p className="mt-2 text-gray-400">Monitor your earnings and payment history.</p>

      {/* Earnings Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <EarningsCard
          title="Total Earnings"
          amount={earningsData.totalEarnings}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <EarningsCard
          title="Pending Payments"
          amount={earningsData.pendingPayments}
          icon={Wallet}
          color="bg-yellow-500"
        />
        <EarningsCard
          title="Last Payment Date"
          amount={earningsData.lastPaymentDate}
          icon={CheckCircle}
          color="bg-blue-500"
        />
      </div>

      {/* Transaction History */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Payment Transactions</h2>

        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-3 text-left">Date</th>
              <th className="py-3 text-left">Amount</th>
              <th className="py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {earningsData.transactions.length > 0 ? (
              earningsData.transactions.map((transaction, index) => (
                <tr key={transaction.id} className={`border-b ${index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"} hover:bg-gray-500 transition-all`}>
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4">{transaction.amount}</td>
                  <td className={`py-3 px-4 ${transaction.status === "Completed" ? "text-green-400" : "text-yellow-400"}`}>
                    {transaction.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-5 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ✅ Earnings Card Component (For Summary)
const EarningsCard = ({ title, amount, icon: Icon, color }) => (
  <div className={`p-5 rounded-lg shadow-md flex items-center justify-between ${color} text-white`}>
    <div>
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-2xl font-bold">{amount}</p>
    </div>
    <Icon className="w-10 h-10" />
  </div>
);

export default Earnings;