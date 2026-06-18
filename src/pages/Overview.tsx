import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { GrStatusGood } from 'react-icons/gr';
import { MdCheckCircle, MdPeople } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { SolidBlueBtn, SolidGrayBtn } from '../component/Btns';
import LoadingOverlay from '../component/LoadingOverlay';
import { useCreateSchoolStudent } from '../hooks/mutation/allMutattion';
import { useGetTeachersOverview, useGetTeachersStudents } from '../hooks/queries/allQueries';

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
const Overview = () => {
  const navigate = useNavigate()
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  // ─── Data fetching ──────────────────────────────────────────────────────────
  const { teacherOverviewData, isLoading } = useGetTeachersOverview()
  const teachersData = teacherOverviewData?.data?.data || {}

  const { teacherStudentsData, isLoading: isStudentLoading, refetch: refetchStudents } = useGetTeachersStudents()
  const studentList = teacherStudentsData?.data?.students || []
  console.log('This is teachersData', studentList)


  // Filter students based on search query
  const filteredStudents = studentList.filter((student: any) => {
    const searchLower = studentSearchQuery.toLowerCase()
    return (
      student?.name?.toLowerCase().includes(searchLower) ||
      student?.email?.toLowerCase().includes(searchLower) ||
      student?.grade?.toString().includes(searchLower)
    )
  })

  const gradeData = teachersData?.studentGrowth
  // console.log('Overview data:', gradeData)

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

    // ── Exact API payload ────────────────────────────────────────────────────
    const payload = {
      name: formData.name.trim(),
      dob: formData.dob,              // "YYYY-MM-DD"
      email: formData.email.trim(),
      grade: Number(formData.grade),  // sent as number
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

  const isPageLoading = isLoading || isStudentLoading

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-8 px-0 max-w-7xl mx-auto">
      <LoadingOverlay visible={isPageLoading || isCreatingSchoolStudent} />
      <ToastContainer theme="dark" position="top-right" autoClose={4000} />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back Admin! Here is an overview of your school progress</p>
        </div>
        {/* <button
          onClick={() => (document.getElementById('create_student_modal') as HTMLDialogElement)?.showModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">+</span>
          Add New Student
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <MdPeople className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Total Students</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{teachersData?.students?.totalStudents ?? '—'}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Active Students</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{teachersData?.students?.activeCount ?? '—'}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <GrStatusGood className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-gray-600 text-sm font-medium">Total Course</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {teachersData?.totalCoursesAvailable === null ? '---' : teachersData?.totalCoursesAvailable ?? '—'}
          </h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={gradeData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 13 }} axisLine={false} tickLine={false} ticks={[1, 10, 100, 200, 500, 1000]} />
              <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                {gradeData?.map((_: any, index: any) => (
                  <Cell key={`cell-${index}`} fill="#3b82f6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recently Enrolled Students */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recently Enrolled Students</h3>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <BiSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students..."
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            {studentSearchQuery && (
              <button
                onClick={() => setStudentSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CgClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

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
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                    {studentList.length === 0 ? 'No students enrolled yet' : 'No students match your search'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student: any, index: number) => (
                  <tr
                    key={student?.id ?? index}
                    onClick={() => navigate(`/student/${student?._id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {!student?.picture ? (
                      <div className='flex items-center'>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-gray-500 text-lg font-medium">{student?.name?.charAt(0)}</span>
                        </div>
                        <td className="py-4 px-4 pl-2 text-gray-900 font-medium text-sm">{student.name}</td>
                      </div>
                    ) : (
                      <div className='flex items-center'>
                        <img
                          src={student?.picture}
                          alt={student?.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
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
                placeholder="e.g. Big Dawg"
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
                placeholder="e.g. wizzyiyk@gmail.com"
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

export default Overview