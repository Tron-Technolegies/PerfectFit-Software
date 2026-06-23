import React from "react";

export default function TransactionsTable() {
  const data = [
    {
      id: "INV-2301",
      name: "Rahul Sharma",
      phone: "+91 98223 10293",
      ref: "Custom Suit",
      amount: "15,000",
      type: "Payment",
      status: "Paid",
    },
    {
      id: "INV-2302",
      name: "Amit Singh",
      phone: "+91 91234 56789",
      ref: "Sherwani Sale",
      amount: "8,000",
      type: "Payment",
      status: "Partial",
    },
    {
      id: "INV-2298",
      name: "Sneha Verma",
      phone: "+91 99887 76655",
      ref: "Lehenga Rental",
      amount: "4,500",
      type: "Payment",
      status: "Overdue",
    },
  ];

  const statusStyle = {
    Paid: "bg-green-100 text-green-600",
    Partial: "bg-orange-100 text-orange-500",
    Overdue: "bg-red-100 text-red-500",
    Completed: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white rounded-xl border border-[#00000014] overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-3 p-4 border-b border-[#00000014]">
        <h3 className="font-semibold">Recent Transactions</h3>

        <div className="flex gap-3">
          <input
            placeholder="Search..."
            className="border border-[#00000014] px-4 py-2 rounded-lg outline-none"
          />

          <button className="border px-4 py-2 rounded-lg border-[#00000014] text-sm">
            Filters
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-[#00000014]">
            <tr>
              <th className="text-left p-3">INVOICE NO</th>
              <th>CUSTOMER</th>
              <th>REFERENCE</th>
              <th>AMOUNT</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {data.map((t, i) => (
              <tr key={i} className="border-b border-[#00000014] hover:bg-gray-50">
                <td className="p-6">{t.id}</td>

                <td>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.phone}</p>
                </td>

                <td>{t.ref}</td>

                <td>₹ {t.amount}</td>

                <td>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{t.type}</span>
                </td>

                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyle[t.status]}`}>
                    {t.status}
                  </span>
                </td>

                <td>⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center p-4 text-xs text-gray-400">
        <p>Showing 1–5 of 142 transactions</p>
        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded">Previous</button>
          <button className="border px-3 py-1 rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
