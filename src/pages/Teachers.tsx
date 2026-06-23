import { AlertCircle, Ban, BookOpen, Mail, X } from 'lucide-react'
import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { toast, ToastContainer } from 'react-toastify'
import { SolidBlueBtn, SolidGrayBtn } from '../component/Btns'
import LoadingOverlay from '../component/LoadingOverlay'
import { useCreateSchoolTeachers, useSuspendTeacher } from '../hooks/mutation/allMutattion'
import { useGetSchoolTeachers } from '../hooks/queries/allQueries'

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeacherFormData {
    firstName: string
    lastName: string
    email: string
    course: string
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    course?: string
}

// ─── Client-side validation ───────────────────────────────────────────────────
const validateForm = (data: TeacherFormData): FormErrors => {
    const errors: FormErrors = {}

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

    if (!data.email.trim()) {
        errors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = 'Please enter a valid email address.'
    }

    if (!data.course.trim()) {
        errors.course = 'Course/Subject is required.'
    }

    return errors
}

// ─── API error parser ─────────────────────────────────────────────────────────
const parseApiErrors = (error: any): string[] => {
    if (!error.response) {
        return [error.message || 'An unexpected error occurred. Please try again.']
    }
    const { data } = error.response
    const messages: string[] = []
    if (!data) return ['An unexpected error occurred. Please try again.']
    if (typeof data === 'string') {
        messages.push(data)
    } else if (typeof data === 'object' && !Array.isArray(data)) {
        Object.entries(data).forEach(([field, value]) => {
            const prefix =
                field === 'non_field_errors' || field === 'detail' || field === 'message'
                    ? ''
                    : field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ': '
            if (Array.isArray(value)) {
                value.forEach((msg: string) => messages.push(`${prefix}${msg}`))
            } else if (typeof value === 'string') {
                messages.push(`${prefix}${value}`)
            }
        })
    }
    return messages.length > 0 ? messages : ['An unexpected error occurred. Please try again.']
}

// ─── Component ────────────────────────────────────────────────────────────────
const Teachers = () => {

    const { schoolTeachers, isLoading: isTeacherLoading, refetch: refetchTeachers } = useGetSchoolTeachers()
    const teacherList = schoolTeachers?.data?.teachers || []

    // ─── Mutation ───────────────────────────────────────────────────────────────
    const { mutate: createSchoolTeacher, isPending: isCreatingSchoolTeacher } = useCreateSchoolTeachers()
    const { mutate: suspendTeacher, isPending: isSuspending } = useSuspendTeacher()

    // ─── Drawer state ───────────────────────────────────────────────────────────
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
    const [showSuspendConfirm, setShowSuspendConfirm] = useState(false)

    // ─── Form state ─────────────────────────────────────────────────────────────
    const initialFormState: TeacherFormData = {
        firstName: '',
        lastName: '',
        email: '',
        course: '',
    }

    const [formData, setFormData] = useState<TeacherFormData>(initialFormState)
    const [formErrors, setFormErrors] = useState<FormErrors>({})

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const closeModal = () => {
        ; (document.getElementById('create_teacher_modal') as HTMLDialogElement)?.close()
        setFormData(initialFormState)
        setFormErrors({})
    }

    const handleSuspendTeacher = () => {
        if (!selectedTeacher?._id) return

        suspendTeacher(
            { teacherID: selectedTeacher._id, data: {} },
            {
                onSuccess: () => {
                    toast.success('Teacher suspended successfully!')
                    setSelectedTeacher(null)
                    setShowSuspendConfirm(false)
                    refetchTeachers()
                },
                onError: (error: any) => {
                    const messages = parseApiErrors(error)
                    messages.forEach((msg) => toast.error(msg))
                },
            }
        )
    }

    const handleCreateTeacher = () => {
        const errors = validateForm(formData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            Object.values(errors).forEach((msg) => toast.error(msg))
            return
        }

        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            course: formData.course.trim(),
        }

        createSchoolTeacher(payload, {
            onSuccess: () => {
                toast.success('Teacher added successfully!')
                refetchTeachers()
                setTimeout(() => closeModal(), 1200)
            },
            onError: (error: any) => {
                const messages = parseApiErrors(error)
                messages.forEach((msg) => toast.error(msg))
            },
        })
    }

    // ─── Table filters & pagination ─────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredTeachers = teacherList.filter((t: any) => {
        const matchesSearch =
            searchQuery === '' ||
            `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.course?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'All' || t.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex)

    const handleTeacherClick = (item: any) => {
        const teacher = item.teacher ?? item
        setSelectedTeacher(teacher)
    }

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 p-8 px-0 max-w-7xl mx-auto">
            <LoadingOverlay visible={isTeacherLoading || isCreatingSchoolTeacher} />
            <ToastContainer theme="dark" position="top-right" autoClose={4000} />

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Teachers</h1>
                    <p className="text-gray-500">Manage teacher profiles, qualifications and assignments</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => (document.getElementById('create_teacher_modal') as HTMLDialogElement)?.showModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <span className="text-xl">+</span>
                        Add New Teacher
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search teacher name, email or course"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="px-5 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                    >
                        <option value="All">Status: All</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Teacher</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Email</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Course</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherList.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-6 px-4 text-center text-gray-500">
                                        No teachers added yet
                                    </td>
                                </tr>
                            ) : (
                                paginatedTeachers.map((teacher: any, index: number) => (
                                    <tr
                                        key={teacher?.id ?? index}
                                        onClick={() => handleTeacherClick(teacher)}
                                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {!teacher?.picture ? (
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-blue-600 text-lg font-medium">
                                                            {teacher?.firstName?.charAt(0)}{teacher?.lastName?.charAt(0)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={teacher?.picture}
                                                        alt={`${teacher?.firstName} ${teacher?.lastName}`}
                                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                    />
                                                )}
                                                <span className="text-gray-900 font-medium text-sm">
                                                    {teacher.firstName} {teacher.lastName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-900 text-sm">{teacher.email}</td>
                                        <td className="py-4 px-4 text-gray-600 text-sm">{teacher.course}</td>
                                        <td className="py-4 px-4">
                                            <button
                                                className={`rounded-3xl px-4 py-1.5 text-xs font-medium transition-colors ${teacher.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {teacher.status}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Showing{' '}
                        <span className="font-semibold">
                            {filteredTeachers.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, filteredTeachers.length)}
                        </span>
                        {' '}of <span className="font-semibold">{filteredTeachers.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ‹
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return (
                                    <span key={pageNum} className="px-2 text-gray-400">
                                        …
                                    </span>
                                )
                            }
                            return null
                        })}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Add New Teacher Modal ───────────────────────────────────────────── */}
            <dialog id="create_teacher_modal" className="modal">
                <div className="modal-box max-w-2xl p-10">
                    <form method="dialog">
                        <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>

                    <div className="border-b border-neutral-100 pb-2">
                        <h3 className="font-bold text-2xl">Add New Teacher</h3>
                        <p className="text-base text-neutral-500">Fill in the details to add a new teacher</p>
                    </div>

                    <div className="pt-5 space-y-4">

                        {/* First Name */}
                        <div>
                            <label className="block text-neutral-900 text-sm font-medium pb-2">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="e.g. John"
                                className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-neutral-900 text-sm font-medium pb-2">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="e.g. Smith"
                                className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-neutral-900 text-sm font-medium pb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. john@school.com"
                                className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>

                        {/* Course */}
                        <div>
                            <label className="block text-neutral-900 text-sm font-medium pb-2">
                                Course/Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                placeholder="e.g. Mathematics, English, Web Development"
                                className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.course ? 'border-red-400 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {formErrors.course && <p className="text-red-500 text-xs mt-1">{formErrors.course}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-auto w-full md:w-1/2 pt-2">
                            <div className="w-full">
                                <SolidGrayBtn title="Cancel" onClick={closeModal} />
                            </div>
                            <div className="w-full">
                                <SolidBlueBtn
                                    title={isCreatingSchoolTeacher ? 'Adding...' : 'Add Teacher'}
                                    onClick={handleCreateTeacher}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </dialog>

            {/* ─── Teacher Details Drawer ───────────────────────────────────────────── */}
            {selectedTeacher && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Teacher Details</h2>
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Profile Section */}
                            <div className="text-center">
                                {selectedTeacher?.picture ? (
                                    <img
                                        src={selectedTeacher.picture}
                                        alt={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
                                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl font-bold text-blue-600">
                                            {selectedTeacher?.firstName?.charAt(0)}{selectedTeacher?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedTeacher?.firstName} {selectedTeacher?.lastName}
                                </h3>
                                <div className="mt-3">
                                    <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${selectedTeacher?.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700'
                                            : selectedTeacher?.status === 'SUSPENDED'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {selectedTeacher?.status || 'Active'}
                                    </span>
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="space-y-3">
                                {/* Email */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
                                        <p className="text-sm font-semibold text-gray-900 break-all">{selectedTeacher?.email}</p>
                                    </div>
                                </div>

                                {/* Course */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Course/Subject</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedTeacher?.course}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-100" />

                            {/* Suspend Confirmation */}
                            {showSuspendConfirm ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-red-900 mb-1">Suspend Teacher?</h4>
                                            <p className="text-xs text-red-700">
                                                This teacher will no longer be able to access the platform. You can reactivate them later.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowSuspendConfirm(false)}
                                            className="flex-1 px-4 py-2.5 border border-red-300 text-red-700 font-medium text-sm rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSuspendTeacher}
                                            disabled={isSuspending}
                                            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSuspending ? 'Suspending...' : 'Yes, Suspend'}
                                        </button>
                                    </div>
                                </div>
                            ) : selectedTeacher?.status === 'SUSPENDED' ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-yellow-900">This teacher is suspended</h4>
                                        <p className="text-xs text-yellow-700 mt-0.5">They currently cannot access the platform.</p>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowSuspendConfirm(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-semibold text-sm rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                                >
                                    <Ban className="w-4 h-4" />
                                    Suspend Teacher
                                </button>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 p-6 space-y-2">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Teachers