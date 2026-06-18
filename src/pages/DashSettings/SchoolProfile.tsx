import { useEffect, useRef, useState } from "react"
import { FaUpload } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import LoadingOverlay from "../../component/LoadingOverlay"
import { useUpdateSchoolProfile } from "../../hooks/mutation/allMutattion"
import { useGetSchoolProfile } from "../../hooks/queries/allQueries"

const SchoolProfile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [schoolName, setSchoolName] = useState("")
  const [schoolDescription, setSchoolDescription] = useState("")
  const [address, setAddress] = useState("")
  const [colorTheme, setColorTheme] = useState("")
  const [phone, setPhone] = useState("")
  const [schoolLogo, setSchoolLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const { mutate, isPending } = useUpdateSchoolProfile()
  const { schoolProfile, isLoading } = useGetSchoolProfile()

  useEffect(() => {
    const data = schoolProfile?.data?.school
    if (!data) return

    setSchoolName(data.name ?? "")
    setSchoolDescription(data.description ?? "")
    setAddress(data.address ?? "")
    setPhone(data.phone ?? "")
    setColorTheme(data.colorTheme ?? "")
    setLogoPreview(data.schoolLogo ?? null)

    // ✅ Sync localStorage with the fetched profile color on load
    if (data.colorTheme) {
      localStorage.setItem("schoolColorTheme", data.colorTheme)
    }
  }, [schoolProfile])

  const handleLogoChange = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    setSchoolLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = () => {
    const formData = new FormData()
    formData.append("name", schoolName)
    formData.append("address", address)
    formData.append("phone", phone)
    formData.append("description", schoolDescription)
    formData.append("colorTheme", colorTheme)
    if (schoolLogo) {
      formData.append("image", schoolLogo)
    }

    mutate(formData, {
      onSuccess: () => {
        // ✅ Persist chosen color to localStorage so Sidebar picks it up
        localStorage.setItem("schoolColorTheme", colorTheme)
        toast.success("School profile updated successfully!")
      },
      onError: (error) => console.error("Error updating school profile:", error),
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <LoadingOverlay visible={isLoading || isPending} />
      <ToastContainer />
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Settings &gt; School Profile</p>
              <h1 className="text-2xl font-bold text-gray-900">School Profile</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Basic Information ── */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">School Description</label>
              <textarea
                value={schoolDescription}
                onChange={(e) => setSchoolDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Color Theme</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorTheme || "#1E6FFF"}
                        onChange={(e) => setColorTheme(e.target.value)}
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">Selected Color</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">{colorTheme || "#1E6FFF"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Or choose from palette</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Blue", value: "#1E6FFF" },
                      { name: "Purple", value: "#8B5CF6" },
                      { name: "Pink", value: "#EC4899" },
                      { name: "Red", value: "#EF4444" },
                      { name: "Orange", value: "#F97316" },
                      { name: "Yellow", value: "#FBBF24" },
                      { name: "Green", value: "#10B981" },
                      { name: "Cyan", value: "#06B6D4" },
                      { name: "Indigo", value: "#6366F1" },
                      { name: "Slate", value: "#64748B" },
                      { name: "Rose", value: "#F43F5E" },
                      { name: "Emerald", value: "#059669" },
                      { name: "Teal", value: "#0D9488" },
                      { name: "Sky", value: "#0EA5E9" },
                      { name: "Fuchsia", value: "#D946EF" },
                      { name: "Lime", value: "#84CC16" },
                      { name: "Amber", value: "#D97706" },
                      { name: "Violet", value: "#7C3AED" },
                      { name: "Zinc", value: "#71717A" },
                      { name: "Neutral", value: "#737373" },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setColorTheme(color.value)}
                        className={`w-14 h-14 rounded-lg transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${colorTheme === color.value ? "ring-2 ring-blue-400 ring-offset-1" : ""
                          }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {colorTheme === color.value && (
                          <svg className="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ── School Logo ── */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">School Logo</h2>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="School logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleLogoChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              >
                <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-900 font-medium mb-1">
                  {schoolLogo ? schoolLogo.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (Max 10MB)</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SchoolProfile  