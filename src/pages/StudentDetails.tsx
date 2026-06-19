import { IoArrowBack } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import LoadingOverlay from "../component/LoadingOverlay"
import { useGetStudentDetails } from "../hooks/queries/allQueries"

const StudentDetail = () => {
  const navigate = useNavigate()

  const { id }: any = useParams()
  const { studentDetailsData, isLoading } = useGetStudentDetails(id)

  // ✅ Updated to match actual API response shape
  const student = studentDetailsData?.data?.student || {}
  const courses: any[] = student?.courses || []
  const quizzesTaken: any[] = studentDetailsData?.data?.quizzesTaken || []
  const studentPerformance: Record<string, number> = studentDetailsData?.data?.studentPerformance || {}

  // ✅ Convert studentPerformance { "1": 0, "2": 80 } → chart-friendly array
  const performanceChartData = Object.entries(studentPerformance).map(([quiz, score]) => ({
    quiz: `Quiz ${quiz}`,
    score,
  }))

  // const { schoolQuizChartData, isLoading: isQuizChartLoading } = useGetSchoolQuizChart()

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-0 max-w-7xl mx-auto">
      <LoadingOverlay visible={isLoading} />

      {/* Back + Student Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <IoArrowBack className="text-xl" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            {!student?.picture ? (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <span className="text-gray-500 text-lg font-medium">{student?.name?.charAt(0)}</span>
              </div>
            ) : (
              <img
                src={student?.picture}
                alt={student?.name}
                className="w-20 h-20 rounded-full object-cover shrink-0"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student?.name}</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Student Email: {student?.email} · Grade {student?.grade}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">
                  {student?.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Enrolled {courses?.length} course{courses?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Courses enrolled */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Courses Enrolled</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{courses?.length}</h2>
        </div>

        {/* Quizzes Taken */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Total Quiz Completed</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{quizzesTaken?.length}</h2>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Average Score</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {quizzesTaken.length > 0
              ? `${Math.round(quizzesTaken.reduce((sum, q) => sum + q.score, 0) / quizzesTaken.length)}%`
              : "—"}
          </h2>
        </div>
      </div>

      {/* Chart + Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quiz Performance</h3>
          {performanceChartData.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
              No performance data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="quiz"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 25, 50, 75, 100]}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Score"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Courses Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Courses</h3>
            {courses.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {courses.length}
              </span>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">No courses enrolled yet</p>
              <p className="text-gray-400 text-xs mt-1">Courses will appear here once assigned</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
              {courses.map((course: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {course.coverImage ? (
                      <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{course.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{course.description}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Quizzes Taken Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Quizzes Taken</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {quizzesTaken.length}
          </span>
        </div>

        {quizzesTaken.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No quizzes taken yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">#</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Quiz Title</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Score</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Result</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Time (mins)</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Date Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quizzesTaken.map((quiz: any, index: number) => (
                  <tr key={quiz.quizId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 pr-4 text-gray-400 font-medium">{index + 1}</td>
                    <td className="py-3.5 pr-4 max-w-xs">
                      <p className="text-gray-800 font-medium truncate">{quiz.title}</p>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-gray-900">{quiz.score}%</span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${quiz.result === "PASSED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                          }`}
                      >
                        {quiz.result}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-gray-600">{quiz.completionTime} min</td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(quiz.dateTaken).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDetail