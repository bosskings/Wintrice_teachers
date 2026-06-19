import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useUpdateTeachersPassword } from '../hooks/mutation/allMutattion';

// ── Types ────────────────────────────────────────────────────────────────────
interface PasswordFormData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

interface PasswordFormErrors {
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
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

const Password = () => {
    const { mutate, isPending } = useUpdateTeachersPassword()

    const [formData, setFormData] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [formErrors, setFormErrors] = useState<PasswordFormErrors>({})

    // ── Validator ───────────────────────────────────────────────────────────
    const validatePasswordForm = (data: PasswordFormData): PasswordFormErrors => {
        const errors: PasswordFormErrors = {}

        if (!data.currentPassword.trim()) {
            errors.currentPassword = 'Current password is required.'
        }

        if (!data.newPassword.trim()) {
            errors.newPassword = 'New password is required.'
        } else if (data.newPassword.trim().length < 8) {
            errors.newPassword = 'New password must be at least 8 characters.'
        }

        if (!data.confirmPassword.trim()) {
            errors.confirmPassword = 'Please confirm your new password.'
        } else if (data.newPassword.trim() !== data.confirmPassword.trim()) {
            errors.confirmPassword = 'Passwords do not match.'
        }

        return errors
    }

    // ── Update Handler ──────────────────────────────────────────────────────
    const handleUpdatePassword = () => {
        const sanitized: PasswordFormData = {
            currentPassword: formData.currentPassword ?? '',
            newPassword: formData.newPassword ?? '',
            confirmPassword: formData.confirmPassword ?? '',
        }

        const errors = validatePasswordForm(sanitized)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            Object.values(errors).forEach((msg) => toast.error(msg))
            return
        }

        setFormErrors({})

        // Matches sample payload: { currentPassword, newPassword }
        const payload = {
            currentPassword: sanitized.currentPassword.trim(),
            newPassword: sanitized.newPassword.trim(),
        }

        mutate(payload, {
            onSuccess: (res: any) => {
                console.log('Password update response:', res.data)
                toast.success('Password updated successfully!')
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            },
            onError: (error: any) => {
                const messages = parseApiErrors(error)
                console.error('Password update failed:', error)
                messages.forEach((msg) => toast.error(msg))
            },
        })
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6 text-sm">
            <ToastContainer theme="dark" position="top-right" autoClose={4000} />

            {/* ── Header ── */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Change Password</h1>
                <p className="text-neutral-600 mt-1">Update the password used to sign in to your account</p>
            </div>

            {/* ── Password Form ── */}
            <div className="bg-white rounded-lg border border-neutral-200 p-8 w-full">
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Security</h3>
                <p className="text-neutral-600 text-sm mb-8">Choose a strong password you haven't used before</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-neutral-900 font-medium text-sm mb-2">Current Password</label>
                        <input
                            type="password"
                            placeholder="Enter Current Password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.currentPassword ? 'border-red-400' : 'border-neutral-300'}`}
                        />
                        {formErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{formErrors.currentPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-neutral-900 font-medium text-sm mb-2">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter New Password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.newPassword ? 'border-red-400' : 'border-neutral-300'}`}
                        />
                        {formErrors.newPassword && <p className="text-red-500 text-xs mt-1">{formErrors.newPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-neutral-900 font-medium text-sm mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Re-enter New Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.confirmPassword ? 'border-red-400' : 'border-neutral-300'}`}
                        />
                        {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="flex justify-start gap-4 pt-6 mt-6 border-t border-neutral-100">
                    <button
                        onClick={handleUpdatePassword}
                        disabled={isPending}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPending ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Password