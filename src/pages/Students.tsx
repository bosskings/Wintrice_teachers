import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { SolidBlueBtn, SolidGrayBtn } from '../component/Btns'
import LoadingOverlay from '../component/LoadingOverlay'
import { useCreateSchoolStudent } from '../hooks/mutation/allMutattion'
import { useGetSchoolStudents } from '../hooks/queries/allQueries'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StudentFormData {
  name: string
  dob: string
  email: string
  grade: string
}

interface FormErrors {
  name?: string
  dob?: string
  email?: string
  grade?: string
}

// ─── Client-side validation ───────────────────────────────────────────────────
const validateForm = (data: StudentFormData): FormErrors => {
  const errors: FormErrors = {}

  if (!data.name.trim()) {
    errors.name = 'Full name is required.'
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  if (!data.dob) {
    errors.dob = 'Date of birth is required.'
  } else {
    const dob = new Date(data.dob)
    const today = new Date()
    if (isNaN(dob.getTime())) {
      errors.dob = 'Please enter a valid date.'
    } else if (dob >= today) {
      errors.dob = 'Date of birth must be in the past.'
    }
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!data.grade.trim()) {
    errors.grade = 'Grade is required.'
  } else if (isNaN(Number(data.grade)) || Number(data.grade) < 1) {
    errors.grade = 'Please enter a valid grade number.'
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
const Students = () => {
  const navigate = useNavigate()


  const { schoolStudentsData, isLoading: isStudentLoading, refetch: refetchStudents } = useGetSchoolStudents()
  const studentList = schoolStudentsData?.data?.students || []

  // ─── Mutation ───────────────────────────────────────────────────────────────
  const { mutate: createSchoolStudent, isPending: isCreatingSchoolStudent } = useCreateSchoolStudent()

  // ─── Form state ─────────────────────────────────────────────────────────────
  const initialFormState: StudentFormData = {
    name: '',
    dob: '',
    email: '',
    grade: '',
  }

  const [formData, setFormData] = useState<StudentFormData>(initialFormState)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const closeModal = () => {
    ; (document.getElementById('create_student_modal') as HTMLDialogElement)?.close()
    setFormData(initialFormState)
    setFormErrors({})
  }

  const handleCreateStudent = () => {
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      Object.values(errors).forEach((msg) => toast.error(msg))
      return
    }
    const payload = {
      name: formData.name.trim(),
      dob: formData.dob,             // "YYYY-MM-DD"
      email: formData.email.trim(),
      grade: Number(formData.grade),   // number, not string
    }

    createSchoolStudent(payload, {
      onSuccess: () => {
        toast.success('Student added successfully!')
        refetchStudents()
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

  const filteredStudents = studentList.filter((s: any) => {
    const matchesSearch =
      searchQuery === '' ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage


  const handleSchoolClick = (item: any) => {
    const student = item.student ?? item
    navigate(`/student/${student._id}`, { state: item })
  }


  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-8 px-0 max-w-7xl mx-auto">
      <LoadingOverlay visible={isStudentLoading || isCreatingSchoolStudent} />
      <ToastContainer theme="dark" position="top-right" autoClose={4000} />

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
          <p className="text-gray-500">Manage student profiles, enrolment and activity</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => (document.getElementById('create_student_modal') as HTMLDialogElement)?.showModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span>
            Add New Student
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
              placeholder="Search student name, student ID"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="px-5 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="All">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="px-5 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option>School Type</option>
            <option>Public</option>
            <option>Private</option>
          </select> */}

        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Student</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Email</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Grade</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">DOB</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-gray-500">No recent student activity</td>
                </tr>
              ) : (
                studentList.map((student: any, index: number) => (
                  <tr
                    key={student?.id ?? index}
                    onClick={() => handleSchoolClick(student)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {!student?.picture ? (
                      <div className='flex items-center'>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-lg font-medium">{student?.name?.charAt(0)}</span>
                        </div>
                        <td className="py-4 px-4 pl-2 text-gray-900 font-medium text-sm">{student.name}</td>
                      </div>
                    ) : (
                      <div className='flex items-center'>
                        <img
                          src={student?.picture}
                          alt="Olivia Ryan"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <td className="py-4 px-4 pl-2 text-gray-900 font-medium text-sm">{student.name}</td>
                      </div>
                    )}
                    <td className="py-4 px-4 text-gray-900 text-sm">
                      {student.email}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">Grade: {student.grade}</td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{new Date(student.dob).toLocaleDateString('en-GB')}</td>
                    <td className="p-2 text-gray-500 text-[10px]">
                      <button className={`bg-gray-100 rounded-3xl p-2 px-4 ${student.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : ''}`}>{student.status}</button>
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
            <span className="font-semibold">{filteredStudents.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, filteredStudents.length)}</span>
            {' '}of <span className="font-semibold">{filteredStudents.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >‹</button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                )
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-2 text-gray-400">…</span>
              }
              return null
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >›</button>
          </div>
        </div>
      </div>

      {/* ─── Add New Student Modal ───────────────────────────────────────────── */}
      <dialog id="create_student_modal" className="modal">
        <div className="modal-box max-w-2xl p-10">
          <form method="dialog">
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <div className="border-b border-neutral-100 pb-2">
            <h3 className="font-bold text-2xl">Add New Student</h3>
            <p className="text-base text-neutral-500">Fill in the details to add a new student</p>
          </div>

          <div className="pt-5 space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-neutral-900 text-sm font-medium pb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. John Smith"
                className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
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
                placeholder="e.g. john@gmail.com"
                className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>

            {/* DOB + Grade */}
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block text-neutral-900 text-sm font-medium pb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.dob ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {formErrors.dob && <p className="text-red-500 text-xs mt-1">{formErrors.dob}</p>}
              </div>
              <div className="w-full">
                <label className="block text-neutral-900 text-sm font-medium pb-2">
                  Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                  min={1}
                  className={`w-full px-4 py-3 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.grade ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {formErrors.grade && <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-auto w-full md:w-1/2 pt-2">
              <div className="w-full"><SolidGrayBtn title="Cancel" onClick={closeModal} /></div>
              <div className="w-full">
                <SolidBlueBtn
                  title={isCreatingSchoolStudent ? 'Adding...' : 'Add Student'}
                  onClick={handleCreateStudent}
                />
              </div>
            </div>

          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Students