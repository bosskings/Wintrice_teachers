import { useState } from 'react'
import { FaCheckCircle, FaClipboardList, FaSearch, FaUsers } from 'react-icons/fa'
import { IoChevronDown, IoClose } from 'react-icons/io5'
import { ToastContainer } from 'react-toastify'
import LoadingOverlay from '../component/LoadingOverlay'
import { useGetTeacherQuizzes } from '../hooks/queries/allQueries'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getResultColor = (result: string) => {
    switch (result?.toUpperCase()) {
        case 'PASSED': return 'bg-green-100 text-green-700'
        case 'FAILED': return 'bg-red-100 text-red-700'
        default: return 'bg-neutral-100 text-neutral-700'
    }
}

const getAttemptBadge = (count: number) => {
    if (count === 0) return 'bg-neutral-100 text-neutral-500'
    return 'bg-blue-100 text-blue-700'
}

// ─── Component ────────────────────────────────────────────────────────────────
const Quizzes = () => {
    const { teacherQuizData, isLoading } = useGetTeacherQuizzes()
    const quizzes: any[] = teacherQuizData?.data?.quizzes || []
    // console.log('This is quizze data', teacherQuizData?.data)

    // ─── Derived stats ────────────────────────────────────────────────────────
    const totalQuizzes = quizzes.length
    const totalAttempts = quizzes.reduce((sum: number, q: any) => sum + (q.studentAttempts?.length ?? 0), 0)
    const quizzesWithAttempts = quizzes.filter((q: any) => q.studentAttempts?.length > 0).length

    // ─── Drawer state ─────────────────────────────────────────────────────────
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null)

    const openDrawer = (quiz: any) => {
        setSelectedQuiz(quiz)
            ; (document.getElementById('quiz-drawer-toggle') as HTMLInputElement)?.click()
    }

    // ─── Filters & pagination ─────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('')
    const [attemptFilter, setAttemptFilter] = useState<'all' | 'attempted' | 'not_attempted'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const handleFilterChange = (
        setter: React.Dispatch<React.SetStateAction<any>>,
        value: any
    ) => {
        setter(value)
        setCurrentPage(1)
    }

    const filteredQuizzes = quizzes.filter((quiz: any) => {
        const matchesSearch =
            searchQuery === '' ||
            quiz.title?.toLowerCase().includes(searchQuery.toLowerCase())

        const hasAttempts = quiz.studentAttempts?.length > 0
        const matchesAttempt =
            attemptFilter === 'all' ||
            (attemptFilter === 'attempted' && hasAttempts) ||
            (attemptFilter === 'not_attempted' && !hasAttempts)

        return matchesSearch && matchesAttempt
    })

    const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex)

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-neutral-50 p-6 text-sm">
            <LoadingOverlay visible={isLoading} />
            <ToastContainer theme="dark" position="top-right" autoClose={4000} />

            <div className="drawer drawer-end">
                <input id="quiz-drawer-toggle" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content">

                    {/* ── Header ── */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Quizzes</h1>
                        <p className="text-neutral-600 mt-1">View all quizzes and student attempts across your courses</p>
                    </div>

                    {/* ── Stats Cards ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FaClipboardList className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-neutral-600 font-medium text-sm">Total Quizzes</span>
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900">{isLoading ? '—' : totalQuizzes}</h2>
                        </div>

                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FaUsers className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-neutral-600 font-medium text-sm">Total Attempts</span>
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900">{isLoading ? '—' : totalAttempts}</h2>
                        </div>

                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FaCheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-neutral-600 font-medium text-sm">Quizzes Attempted</span>
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900">{isLoading ? '—' : quizzesWithAttempts}</h2>
                        </div>
                    </div>

                    {/* ── Search & Filters ── */}
                    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">

                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search by quiz title"
                                    value={searchQuery}
                                    onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={attemptFilter}
                                    onChange={(e) => handleFilterChange(setAttemptFilter, e.target.value)}
                                    className="appearance-none px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                                >
                                    <option value="all">All Quizzes</option>
                                    <option value="attempted">Has Attempts</option>
                                    <option value="not_attempted">No Attempts</option>
                                </select>
                                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            </div>

                        </div>
                    </div>

                    {/* ── Quizzes Table ── */}
                    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Quiz Title</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Grade</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Questions</th>
                                        <th className="text-left py-4 px-6 text-blue-900 font-semibold text-sm">Attempts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentQuizzes.length > 0 ? (
                                        currentQuizzes.map((quiz: any) => {
                                            const attemptCount = quiz.studentAttempts?.length ?? 0
                                            return (
                                                <tr
                                                    key={quiz.quizId}
                                                    onClick={() => openDrawer(quiz)}
                                                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer"
                                                >
                                                    <td className="py-4 px-6">
                                                        <p className="text-neutral-900 font-medium leading-snug">{quiz.title}</p>
                                                    </td>
                                                    <td className="py-4 px-6 text-neutral-600">
                                                        Grade {quiz.grade}
                                                    </td>
                                                    <td className="py-4 px-6 text-neutral-600">
                                                        {quiz.totalQuestions} question{quiz.totalQuestions !== 1 ? 's' : ''}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttemptBadge(attemptCount)}`}>
                                                            {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 px-6 text-center text-neutral-400">
                                                {isLoading ? 'Loading quizzes…' : 'No quizzes found matching your criteria'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Pagination ── */}
                        {filteredQuizzes.length > 0 && (
                            <div className="flex items-center justify-between p-4 border-t border-neutral-100">
                                <p className="text-sm text-neutral-600">
                                    Showing{' '}
                                    <span className="font-medium">{startIndex + 1}–{Math.min(endIndex, filteredQuizzes.length)}</span>
                                    {' '}of <span className="font-medium">{filteredQuizzes.length}</span>
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

                {/* ── Quiz Detail Drawer ── */}
                <div className="drawer-side z-50">
                    <label htmlFor="quiz-drawer-toggle" aria-label="close sidebar" className="drawer-overlay" />

                    <div className="bg-white min-h-full w-[700px] flex flex-col shadow-xl">

                        {/* Drawer Header */}
                        <div className="px-8 py-6 border-b border-neutral-200 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-neutral-900 leading-snug">
                                    {selectedQuiz?.title}
                                </h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs text-neutral-500">Grade {selectedQuiz?.grade}</span>
                                    <span className="text-neutral-300">•</span>
                                    <span className="text-xs text-neutral-500">
                                        {selectedQuiz?.totalQuestions} question{selectedQuiz?.totalQuestions !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-neutral-300">•</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAttemptBadge(selectedQuiz?.studentAttempts?.length ?? 0)}`}>
                                        {selectedQuiz?.studentAttempts?.length ?? 0} attempt{selectedQuiz?.studentAttempts?.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            <label
                                htmlFor="quiz-drawer-toggle"
                                className="cursor-pointer p-1 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                            >
                                <IoClose className="text-neutral-500 text-xl" />
                            </label>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

                            {/* Summary row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 text-center">
                                    <p className="text-2xl font-bold text-neutral-900">
                                        {selectedQuiz?.totalQuestions ?? '—'}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">Total Questions</p>
                                </div>
                                <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 text-center">
                                    <p className="text-2xl font-bold text-neutral-900">
                                        {selectedQuiz?.studentAttempts?.length ?? 0}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">Student Attempts</p>
                                </div>
                                <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 text-center">
                                    <p className="text-2xl font-bold text-neutral-900">
                                        {selectedQuiz?.studentAttempts?.length > 0
                                            ? `${Math.round(
                                                selectedQuiz.studentAttempts.reduce(
                                                    (sum: number, a: any) => sum + (a.score ?? 0), 0
                                                ) / selectedQuiz.studentAttempts.length
                                            )}%`
                                            : '—'}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">Avg. Score</p>
                                </div>
                            </div>

                            {/* Student Attempts */}
                            <div className="border-t border-neutral-100 pt-6">
                                <h3 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-widest">
                                    Student Attempts
                                    {selectedQuiz?.studentAttempts?.length > 0 && (
                                        <span className="ml-2 text-xs font-normal normal-case text-neutral-400">
                                            ({selectedQuiz.studentAttempts.length})
                                        </span>
                                    )}
                                </h3>

                                {selectedQuiz?.studentAttempts?.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedQuiz.studentAttempts.map((attempt: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="rounded-xl border border-neutral-200 bg-neutral-50 p-5"
                                            >
                                                {/* Student info row */}
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                            <span className="text-blue-700 font-semibold text-sm">
                                                                {attempt.studentName?.charAt(0) ?? '?'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-neutral-900">
                                                                {attempt.studentName}
                                                            </p>
                                                            <p className="text-xs text-neutral-500">{attempt.studentEmail}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${getResultColor(attempt.result)}`}>
                                                        {attempt.result}
                                                    </span>
                                                </div>

                                                {/* Stats grid */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
                                                        <p className="text-lg font-bold text-neutral-900">{attempt.score ?? '—'}%</p>
                                                        <p className="text-xs text-neutral-500 mt-0.5">Score</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
                                                        <p className="text-lg font-bold text-neutral-900">
                                                            {attempt.completionTime != null ? `${attempt.completionTime}m` : '—'}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 mt-0.5">Time Taken</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg border border-neutral-200 p-3 text-center">
                                                        <p className="text-lg font-bold text-neutral-900">
                                                            {attempt.performance ?? '—'}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 mt-0.5">Performance</p>
                                                    </div>
                                                </div>

                                                {/* Date taken */}
                                                <p className="text-xs text-neutral-400 mt-3">
                                                    Taken on{' '}
                                                    {attempt.dateTaken
                                                        ? new Date(attempt.dateTaken).toLocaleDateString('en-GB', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                        }) +
                                                        ' at ' +
                                                        new Date(attempt.dateTaken).toLocaleTimeString('en-GB', {
                                                            hour: '2-digit', minute: '2-digit',
                                                        })
                                                        : '—'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                            <FaClipboardList className="w-6 h-6 text-neutral-400" />
                                        </div>
                                        <p className="text-sm font-medium text-neutral-600">No attempts yet</p>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Students haven't taken this quiz yet
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Quizzes