import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../component/LoadingOverlay";
import { useUpdateTeacherProfile } from '../hooks/mutation/allMutattion';
import { useGetTeacherProfile } from '../hooks/queries/allQueries';

// ── Types ────────────────────────────────────────────────────────────────────
interface ProfileFormData {
  firstName: string
  lastName: string
}

interface ProfileFormErrors {
  firstName?: string
  lastName?: string
}

// ── API error parser ─────────────────────────────────────────────────────────
const parseApiErrors = (error: any): string[] => {
  const messages: string[] = []

  if (!error.response) {
    messages.push(error.message || 'An unexpected error occurred.')
    return messages
  }

  const { data } = error.response
  if (!data) return messages

  if (typeof data === 'string') {
    messages.push(data)
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    Object.values(data).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((msg: string) => messages.push(msg))
      } else if (typeof value === 'string') {
        messages.push(value)
      }
    })
  }

  return messages
}

const Settings = () => {
  const { teacherProfiile, isLoading, refetch: refetchProfile } = useGetTeacherProfile()
  const { mutate, isPending } = useUpdateTeacherProfile()

  const teacher = teacherProfiile?.data?.teacher || {}

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
  })
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({})

  useEffect(() => {
    if (teacher?._id) {
      setFormData({
        firstName: teacher?.firstName ?? '',
        lastName: teacher?.lastName ?? '',
      })
    }
  }, [teacher])

  // ── Validator ───────────────────────────────────────────────────────────
  const validateProfileForm = (data: ProfileFormData): ProfileFormErrors => {
    const errors: ProfileFormErrors = {}

    if (!data.firstName.trim()) {
      errors.firstName = 'First name is required.'
    } else if (data.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters.'
    }

    if (!data.lastName.trim()) {
      errors.lastName = 'Last name is required.'
    } else if (data.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters.'
    }

    return errors
  }

  // ── Update Handler ──────────────────────────────────────────────────────
  const handleUpdateProfile = () => {
    const sanitized: ProfileFormData = {
      firstName: formData.firstName ?? '',
      lastName: formData.lastName ?? '',
    }

    const errors = validateProfileForm(sanitized)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      Object.values(errors).forEach((msg) => toast.error(msg))
      return
    }

    setFormErrors({})

    const payload = {
      firstName: sanitized.firstName.trim(),
      lastName: sanitized.lastName.trim(),
    }

    mutate(payload, {
      onSuccess: (res: any) => {
        console.log('Profile update response:', res.data)
        toast.success('Profile updated successfully!')
        refetchProfile()
      },
      onError: (error: any) => {
        const messages = parseApiErrors(error)
        console.error('Profile update failed:', error)
        messages.forEach((msg) => toast.error(msg))
      },
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 text-sm">
      <LoadingOverlay visible={isLoading} />
      <ToastContainer theme="dark" position="top-right" autoClose={4000} />

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-600 mt-1">Update your personal teaching profile</p>
      </div>

      {/* ── Read-only Info Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">Email</p>
          <p className="text-neutral-900 font-medium">{teacher?.email || '—'}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">Course</p>
          <p className="text-neutral-900 font-medium">{teacher?.course || '—'}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wide mb-2">Status</p>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {teacher?.status || '—'}
          </span>
        </div>
      </div>

      {/* ── Profile Form ── */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8 w-full">
        <h3 className="text-lg font-bold text-neutral-900 mb-1">Personal Information</h3>
        <p className="text-neutral-600 text-sm mb-8">Edit your first and last name</p>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-neutral-900 font-medium text-sm mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.firstName ? 'border-red-400' : 'border-neutral-300'}`}
              />
              {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
            </div>

            <div>
              <label className="block text-neutral-900 font-medium text-sm mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.lastName ? 'border-red-400' : 'border-neutral-300'}`}
              />
              {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
            </div>
          </div>

          <div className="flex justify-start gap-4 pt-6 border-t border-neutral-100">
            <button
              onClick={handleUpdateProfile}
              disabled={isPending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings