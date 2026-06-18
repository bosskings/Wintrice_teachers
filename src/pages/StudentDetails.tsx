import { IoArrowBack } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import LoadingOverlay from "../component/LoadingOverlay"
import { useGetSchoolQuizChart, useGetStudentDetails } from "../hooks/queries/allQueries"


const StudentDetail = () => {
  const navigate = useNavigate()

  const { id }: any = useParams()
  const { studentDetailsData, isLoading } = useGetStudentDetails(id)
  const student = studentDetailsData?.data?.student || {}
  const courses: any[] = studentDetailsData?.data?.overview?.availableCourses || []
  const quiz: any[] = studentDetailsData?.data?.overview?.availableQuizzes || []
  const quizTaken: any[] = studentDetailsData?.data?.student?.quizzes || []

  const { schoolQuizChartData, isLoading: isQuizChartLoading } = useGetSchoolQuizChart()
  const quizData = schoolQuizChartData?.data?.quizData || []

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-0 max-w-7xl mx-auto">
      <LoadingOverlay visible={isLoading || isQuizChartLoading} />
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <IoArrowBack className="text-xl" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
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
                <p className="text-gray-500 mt-1 text-sm">Student Email: {student?.email} · Grade {student?.grade}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">{student?.status}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Enrolled {student?.courses?.length} courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Total Courses Available</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{courses?.length}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Total Quiz Completed</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{quizTaken?.length}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Total Quiz Available</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{quiz?.length}</h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quiz Scores Over Time */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Quiz Scores Over Time</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={quizData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="quarter"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
              {courses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {/* Cover image — fixed square */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {course.coverImage ? (
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Text — truncated, never overflows */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-snug mt-0.5">
                      {course.description}
                    </p>
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
    </div>
  )
}

export default StudentDetail