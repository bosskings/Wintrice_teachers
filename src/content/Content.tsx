import { Navigate, Route, Routes } from 'react-router-dom'
import Courses from '../pages/Courses'
import Overview from '../pages/Overview'
import Password from '../pages/Password'
import Quizzess from '../pages/Quizzess'
import Settings from '../pages/Settings'
import StudentDetail from '../pages/StudentDetails'
import Students from '../pages/Students'

const Content = () => {
  return (
    <div className='main-content h-[98vh] w-full overflow-y-scroll'>
      <Routes>
        <Route path='/' element={<Navigate to={'/overview'} />} />
        <Route path='/overview' element={<Overview />} />
        <Route path='/students' element={<Students />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/quizzes' element={<Quizzess />} />
        <Route path='/student/:id' element={<StudentDetail />} />
        <Route path='/profile' element={<Settings />} />
        <Route path='/password' element={<Password />} />
      </Routes>

    </div>
  )
}

export default Content
