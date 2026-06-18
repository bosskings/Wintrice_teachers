import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { IoArrowBack } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

const progressData = [
  { month: "Q1", progress: 25 },
  { month: "Q2", progress: 30 },
  { month: "Q3", progress: 45 },
  { month: "Q4", progress: 90 },
  { month: "Q5", progress: 100 },
  { month: "Q6", progress: 70 },
  { month: "Q7", progress: 50 },
]

const topPerformers = [
  {
    name: "Eleanor Pena",
    completion: "98% Completion",
    grade: "A+",
    gradeValue: "Avg. 95/5",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    name: "Cameron Williamson",
    completion: "95% Completion",
    grade: "A",
    gradeValue: "Avg. 92/5",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    name: "Jane Cooper",
    completion: "92% Completion",
    grade: "A-",
    gradeValue: "Avg. 87/5",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  },
  {
    name: "Wade Warren",
    completion: "90% Completion",
    grade: "B+",
    gradeValue: "Avg. 85/5",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  }
]

const studentProgress = [
  {
    name: "Olivia Ryan",
    coursesEnrolled: 5,
    progress: 100,
    lastActivity: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  {
    name: "Liam Johnson",
    coursesEnrolled: 3,
    progress: 35,
    lastActivity: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  {
    name: "Noah Williams",
    coursesEnrolled: 4,
    progress: 85,
    lastActivity: "3 days ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  },
  {
    name: "Emma Brown",
    coursesEnrolled: 6,
    progress: 60,
    lastActivity: "5 months ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  }
]

const ProgressTracking = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <IoArrowBack className="text-xl" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracking</h1>
            <p className="text-gray-500">An overview of student progress and engagement</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement)?.showModal()}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Export Report
            </button>
            <button 
              onClick={() => navigate(`/student/1`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Avg. Completion Rate</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">72%</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Avg. Time to Complete</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">4.5h</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Engagement Score</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">8.2/10</h2>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-600 font-medium text-sm">Quizzes passed</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">91%</h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Class-wide Progress Over Time */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Class-wide Progress over Time</h3>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 30 Days</option>
              <option>Last 7 days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="month" 
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
                dataKey="progress" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performers</h3>
          
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center gap-3">
                <img 
                  src={performer.avatar}
                  alt={performer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{performer.name}</p>
                  <p className="text-xs text-gray-500">{performer.completion}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{performer.grade}</p>
                  <p className="text-xs text-gray-500">{performer.gradeValue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Progress Details */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Student Progress Details</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All Students
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="text-left py-4 px-6 text-blue-600 font-semibold text-sm">Student Name</th>
                <th className="text-left py-4 px-6 text-blue-600 font-semibold text-sm">Course Enrolled</th>
                <th className="text-left py-4 px-6 text-blue-600 font-semibold text-sm">Progress</th>
                <th className="text-left py-4 px-6 text-blue-600 font-semibold text-sm">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {studentProgress.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-gray-900 font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{student.coursesEnrolled}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${student.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{student.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


            <dialog id="my_modal_3" className="modal">
              <div className="modal-box max-w-3xl p-10">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
      
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h3 className="font-bold text-2xl text-gray-900">Data Export</h3>
                  <p className="text-gray-500 mt-1">Generate and download reports for your school data</p>
                </div>
     
                    <div className="">
                        <p className="text-gray-500 text-sm mb-6">Generate & download reports for your school data</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-900 text-sm font-medium mb-2">Report Type</label>
                                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Student Performance Records</option>
                                <option>Enrollment Report</option>
                                <option>Activity Log</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                <label className="block text-gray-900 text-sm font-medium mb-2">Start Date</label>
                                <input 
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                </div>
                                <div>
                                <label className="block text-gray-900 text-sm font-medium mb-2">End Date</label>
                                <input 
                                    type="text"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-900 text-sm font-medium mb-2">Filter by Course (optional)</label>
                                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>All Courses</option>
                                <option>Intro to Investing</option>
                                <option>Budgeting 101</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-900 text-sm font-medium mb-2">Export Format</label>
                                <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input type="radio" name="format" value="csv" defaultChecked className="mr-2 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">CSV</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="format" value="pdf" className="mr-2 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">PDF</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="format" value="xlsx" className="mr-2 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">XLSX</span>
                                </label>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mt-6">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Generate Report
                            </button>
                        </div>
                    </div>
              </div>
            </dialog>
    </div>
  )
}

export default ProgressTracking