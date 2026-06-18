import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Billing = () => {
  const navigate = useNavigate()

  const billingHistory = [
    { id: "INV-2024-0012", date: "June 2, 2025", amount: "$299.00", status: "Paid" },
    { id: "INV-2024-0011", date: "July 1, 2025", amount: "$299.00", status: "Paid" },
    { id: "INV-2024-0010", date: "August 1, 2025", amount: "$299.00", status: "Paid" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Back
          </button>
          <div>
            <p className="text-sm text-gray-600 mb-1">Settings &gt; Notifications</p>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
            <p className="text-sm text-gray-600">Manage your plan, payment methods, and view your invoice history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
            <div className="mb-4">
              <p className="text-blue-600 font-medium mb-1">Premium School Plan</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">$299/month</p>
              <p className="text-sm text-gray-600">Your plan renews on August 21, 2026. This plan includes up to 500 students and unlimited courses.</p>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Upgrade Plan
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg mb-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                VISA
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-sm text-gray-600">Expires 05/2026</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Update
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Invoice ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((invoice, index) => (
                  <tr key={invoice.id} className={index !== billingHistory.length - 1 ? "border-b border-gray-100" : ""}>
                    <td className="py-4 px-4 text-sm text-gray-900">{invoice.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{invoice.date}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{invoice.amount}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing