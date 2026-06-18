import { Navigate, Route, Routes } from 'react-router-dom'
import Overview from '../pages/Overview'
import Settings from '../pages/Settings'
import StudentDetail from '../pages/StudentDetails'
import Teachers from '../pages/Teachers'

const Content = () => {
  return (
    <div className='main-content h-[98vh] w-full overflow-y-scroll'>
      <Routes>
        <Route path='/' element={<Navigate to={'/overview'} />} />
        <Route path='/overview' element={<Overview />} />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/student/:id' element={<StudentDetail />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>

    </div>
  )
}

export default Content
