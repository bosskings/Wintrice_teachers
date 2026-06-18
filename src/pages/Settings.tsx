import { FaBell, FaCog, FaCreditCard, FaGraduationCap, FaUser } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Settings = () => {
  const navigate = useNavigate()

  const settingsCards = [
    {
      id: "school-profile",
      title: "School Profile",
      description: "Manage institution name, branding and contact details",
      icon: <FaGraduationCap className="w-6 h-6" />,
      route: "/settings/school-profile"
    },
    {
      id: "my-account",
      title: "My Account",
      description: "Update personal info, password, and security settings.",
      icon: <FaUser className="w-6 h-6" />,
      route: "/settings/school-account"
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure email and in-app notification preferences",
      icon: <FaBell className="w-6 h-6" />,
      route: "/settings/school-notifications"
    },
    {
      id: "billing",
      title: "Billing & Subscriptions",
      description: "View subscription, payment history, and billing info",
      icon: <FaCreditCard className="w-6 h-6" />,
      route: "/settings/school-billing"
    },
    {
      id: "system-preferences",
      title: "System Preferences",
      description: "Adjust language, timezone and accessibility zones",
      icon: <FaCog className="w-6 h-6" />,
      route: "/settings/school-system-preferences"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your school profile, user accounts, billing and system preferences</p>
        </div>

        {/* Settings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(card.route)}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Settings