import { useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const SystemPreferences = () => {
  const navigate = useNavigate()
  
  const [language, setLanguage] = useState("English (US)")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [exportSchedule, setExportSchedule] = useState("Daily")
  const [exportFormat, setExportFormat] = useState("CSV")
  const [studentConsentForms, setStudentConsentForms] = useState(true)

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
            <p className="text-sm text-gray-600 mb-1">Settings &gt; System Preferences</p>
            <h1 className="text-2xl font-bold text-gray-900">System Preferences</h1>
            <p className="text-sm text-gray-600">Manage platform-wide theme, language and data settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Theme & Appearance</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">Appearance</label>
              <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                <div className="w-8 h-8 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-900">Toggle between light and dark mode</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">School Logo</label>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Upload</button>
              </div>
              <p className="text-xs text-gray-600">Update logo for the portal</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Language & Region</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Default Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Date Format</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Export</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Export Schedule</label>
                <div className="flex items-center gap-3">
                  {["Daily", "Weekly", "Monthly"].map((schedule) => (
                    <button
                      key={schedule}
                      onClick={() => setExportSchedule(schedule)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        exportSchedule === schedule
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {schedule}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Export Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>CSV</option>
                  <option>JSON</option>
                  <option>XML</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Privacy</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Student Consent Forms</p>
                <p className="text-sm text-gray-600">Require consent upon first login</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={studentConsentForms}
                  onChange={(e) => setStudentConsentForms(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemPreferences