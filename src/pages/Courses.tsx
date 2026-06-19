import { useState } from 'react'
import { FaBook, FaCheckCircle, FaSearch } from 'react-icons/fa'
import { IoChevronDown, IoClose } from 'react-icons/io5'
import { ToastContainer } from 'react-toastify'
import LoadingOverlay from '../component/LoadingOverlay'
import { useGetTeacherCourses } from '../hooks/queries/allQueries'

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_OPTIONS = ['FINANCE', 'INVESTING', 'INTRO', 'BASICS', 'ACCOUNTING', 'ECONOMICS']

// ─── Status helpers ───────────────────────────────────────────────────────────
const getStatusColor = (status: any) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-green-100 text-green-700'
        case 'DRAFT': return 'bg-yellow-100 text-yellow-700'
        case 'ARCHIVED': return 'bg-red-100 text-red-700'
        default: return 'bg-neutral-100 text-neutral-700'
    }
}

// ─── Component ────────────────────────────────────────────────────────────────
const Courses = () => {

    // ─── Data fetching ──────────────────────────────────────────────────────────
    const { teacherCoursesData, isLoading } = useGetTeacherCourses()
    const courses: any[] = teacherCoursesData?.data?.courses || []
    console.log('This is courses', teacherCoursesData?.data)

    // ─── Derived stats ──────────────────────────────────────────────────────────
    const totalCourses = courses.length
    const activeCourses = courses.filter(
        (c) => c.status === 'ACTIVE' || c.status === 'Active'
    ).length

    // ─── Drawer state ───────────────────────────────────────────────────────────
    const [selectedCourse, setSelectedCourse] = useState<any>(null)

    const openDrawer = (course: any) => {
        setSelectedCourse(course)
            ; (document.getElementById('course-drawer-toggle') as HTMLInputElement)?.click()
    }

    // ─── Table filters & pagination ─────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [gradeFilter, setGradeFilter] = useState<number[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const handleGradeFilterChange = (grade: number) => {
        setGradeFilter((prev) =>
            prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
        )
        setCurrentPage(1)
    }

    const handleFilterChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        value: string
    ) => {
        setter(value)
        setCurrentPage(1)
    }

    const filteredCourses = courses.filter((course: any) => {
        const matchesSearch =
            searchQuery === '' ||
            course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory =
            categoryFilter === 'All' || course.category === categoryFilter

        const matchesGrade =
            gradeFilter.length === 0 ||
            (Array.isArray(course.gradeLevel)
                ? course.gradeLevel.some((g: number) => gradeFilter.includes(g))
                : gradeFilter.includes(course.gradeLevel))

        return matchesSearch && matchesCategory && matchesGrade
    })

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentCourses = filteredCourses.slice(startIndex, endIndex)

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-neutral-50 p-6 text-sm">
            <LoadingOverlay visible={isLoading} />
            <ToastContainer theme="dark" position="top-right" autoClose={4000} />

            {/* ── Drawer wrapper ── */}
            <div className="drawer drawer-end">
                <input id="course-drawer-toggle" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content">

                    {/* ── Header ── */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">My Courses</h1>
                        <p className="text-neutral-600 mt-1">Browse all courses assigned to you</p>
                    </div>

                    {/* ── Stats Cards ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FaBook className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-neutral-600 font-medium text-sm">Total Courses</span>
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900">
                                {isLoading ? '—' : totalCourses}
                            </h2>
                        </div>

                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FaCheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-neutral-600 font-medium text-sm">Active Courses</span>
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900">
                                {isLoading ? '—' : activeCourses}
                            </h2>
                        </div>
                    </div>

                    {/* ── Search & Filters ── */}
                    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">

                            {/* Search */}
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title or code"
                                    value={searchQuery}
                                    onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category filter */}
                            <div className="relative">
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => handleFilterChange(setCategoryFilter, e.target.value)}
                                    className="appearance-none px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                >
                                    <option value="All">All Categories</option>
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            </div>

                            {/* Grade filter */}
                            <div className="relative group">
                                <button className="appearance-none px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer w-full text-left">
                                    Grade {gradeFilter.length > 0 && `(${gradeFilter.length})`}
                                </button>
                                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <div className="absolute right-0 mt-1 w-56 bg-white border border-neutral-300 rounded-lg shadow-lg hidden group-hover:block z-10 p-3 space-y-2">
                                    {[...Array(12)].map((_, i) => {
                                        const grade = i + 1
                                        return (
                                            <label
                                                key={grade}
                                                className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={gradeFilter.includes(grade)}
                                                    onChange={() => handleGradeFilterChange(grade)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                                <span className="text-sm text-neutral-700">Grade {grade}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Courses Table ── */}
                    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Image</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Title</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Code</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Category</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Grade</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Duration</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Date Created</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCourses.length > 0 ? (
                                        currentCourses.map((course: any) => (
                                            <tr
                                                key={course._id ?? course.id}
                                                onClick={() => openDrawer(course)}
                                                className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer"
                                            >
                                                {/* Cover image */}
                                                <td className="py-2 px-6">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100">
                                                        {course.coverImage ? (
                                                            <img
                                                                src={course.coverImage}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                                <FaBook className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-neutral-900 font-medium">{course.title}</td>
                                                <td className="py-4 px-6 text-neutral-600">{course.courseCode}</td>
                                                <td className="py-4 px-6 text-neutral-600">{course.category}</td>
                                                <td className="py-4 px-6 text-neutral-600">
                                                    {Array.isArray(course.gradeLevel)
                                                        ? course.gradeLevel.join(', ')
                                                        : course.gradeLevel}
                                                </td>
                                                <td className="py-4 px-6 text-neutral-600">
                                                    {course.duration != null
                                                        ? `${course.duration} week${course.duration !== 1 ? 's' : ''}`
                                                        : '—'}
                                                </td>
                                                <td className="py-4 px-6 text-neutral-600">
                                                    {course.createdAt
                                                        ? new Date(course.createdAt).toLocaleDateString('en-GB')
                                                        : 'N/A'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}
                                                    >
                                                        {course.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="py-12 px-6 text-center text-neutral-400">
                                                {isLoading ? 'Loading courses…' : 'No courses found matching your criteria'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Pagination ── */}
                        {filteredCourses.length > 0 && (
                            <div className="flex items-center justify-between p-4 border-t border-neutral-100">
                                <p className="text-sm text-neutral-600">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {startIndex + 1}–{Math.min(endIndex, filteredCourses.length)}
                                    </span>{' '}
                                    of <span className="font-medium">{filteredCourses.length}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 border border-neutral-300 rounded transition-colors ${currentPage === 1
                                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                            : 'hover:bg-neutral-50 cursor-pointer'
                                            }`}
                                    >
                                        &lt;
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
                                                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${currentPage === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-neutral-300 hover:bg-neutral-50'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                            return <span key={pageNum} className="px-2">…</span>
                                        }
                                        return null
                                    })}

                                    <button
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 border border-neutral-300 rounded transition-colors ${currentPage === totalPages
                                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                            : 'hover:bg-neutral-50 cursor-pointer'
                                            }`}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>{/* end drawer-content */}

                {/* ── Course Detail Drawer ── */}
                <div className="drawer-side z-50">
                    <label
                        htmlFor="course-drawer-toggle"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    />

                    <div className="bg-white min-h-full w-[700px] flex flex-col shadow-xl">

                        {/* Drawer Header */}
                        <div className="px-8 py-6 border-b border-neutral-200 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-neutral-900 truncate">
                                    {selectedCourse?.title}
                                </h2>
                                <p className="text-sm text-neutral-500 mt-0.5">{selectedCourse?.courseCode}</p>
                                <span
                                    className={`mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCourse?.status)}`}
                                >
                                    {selectedCourse?.status}
                                </span>
                            </div>

                            <label
                                htmlFor="course-drawer-toggle"
                                className="cursor-pointer p-1 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                            >
                                <IoClose className="text-neutral-500 text-xl" />
                            </label>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

                            {/* Cover image */}
                            <div className="w-full h-48 rounded-xl overflow-hidden bg-neutral-100">
                                {selectedCourse?.coverImage ? (
                                    <img
                                        src={selectedCourse.coverImage}
                                        alt={selectedCourse.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                        <FaBook className="w-12 h-12" />
                                    </div>
                                )}
                            </div>

                            {/* Course details grid */}
                            <div>
                                <h3 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-widest">
                                    Course Details
                                </h3>
                                <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Category</p>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {selectedCourse?.category ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Grade Level</p>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {Array.isArray(selectedCourse?.gradeLevel)
                                                ? selectedCourse.gradeLevel.join(', ')
                                                : selectedCourse?.gradeLevel ?? '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Duration</p>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {selectedCourse?.duration != null
                                                ? `${selectedCourse.duration} week${selectedCourse.duration !== 1 ? 's' : ''}`
                                                : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Date Created</p>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {selectedCourse?.createdAt
                                                ? new Date(selectedCourse.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="border-t border-neutral-100 pt-6">
                                <h3 className="text-xs font-bold text-neutral-900 mb-3 uppercase tracking-widest">
                                    Description
                                </h3>
                                {selectedCourse?.description ? (
                                    <div
                                        className="text-sm text-neutral-600 leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: selectedCourse.description }}
                                    />
                                ) : (
                                    <p className="text-sm text-neutral-400">No description provided.</p>
                                )}
                            </div>

                            {/* Course Content sections */}
                            {selectedCourse?.courseContent?.length > 0 && (
                                <div className="border-t border-neutral-100 pt-6">
                                    <h3 className="text-xs font-bold text-neutral-900 mb-5 uppercase tracking-widest">
                                        Course Content
                                        <span className="ml-2 text-xs font-normal normal-case text-neutral-400">
                                            ({selectedCourse.courseContent.length} item
                                            {selectedCourse.courseContent.length !== 1 ? 's' : ''})
                                        </span>
                                    </h3>
                                    <div className="space-y-5">
                                        {selectedCourse.courseContent.map((item: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden"
                                            >
                                                <div className="p-5">
                                                    <p className="text-sm font-semibold text-neutral-800 mb-2">
                                                        {item.header || `Item ${idx + 1}`}
                                                    </p>
                                                    {item.body && (
                                                        <div
                                                            className="text-sm text-neutral-600 leading-relaxed prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: item.body }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>{/* end drawer wrapper */}
        </div>
    )
}

export default Courses