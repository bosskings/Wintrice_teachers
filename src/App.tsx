import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar'
import SideBar from './component/SideBar'
import Content from './content/Content'
import './index.css'
import Login from './pages/Login'
import AuthProvider from './providers/AuthProvider'
import ProtectedRoute from './providers/ProtectedRoute'

const App = () => {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            {/* <Route path='/request-auth-code' element={<RequestAuthCode />} /> */}
            <Route
              path="*"
              element={
                <ProtectedRoute
                  element={
                    <div className="flex min-h-screen bg-[#F8FAFC]">
                      <SideBar />
                      <div className="flex-1 ml-60">
                        <Navbar />
                        <div className="mt-24 px-6">
                          <Content />
                        </div>
                      </div>
                    </div>
                  }
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App