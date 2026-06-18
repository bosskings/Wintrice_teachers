import { FiLogOut } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navigationLink } from '../data/sideBarData'

const SideBar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('wintriceTeacherToken')
    navigate('/')
  }

  return (
    <div
      className='h-screen w-60 pt-6 flex flex-col fixed left-0 top-0 overflow-y-auto transition-colors duration-300'
      style={{ backgroundColor: '#1E6FFF' }}
    >
      {/* Logo/Brand Area */}
      <div className='px-5 mb-8'>
        <h2 className='text-white text-xl font-semibold'>Schools</h2>
      </div>

      {/* Main Menu Section */}
      <div className='mb-10'>
        <p className='text-white/60 text-xs font-medium px-5 mb-3 tracking-wider'>Main Menu</p>
        <nav>
          <ul className='p-4'>
            {navigationLink.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.path}
                  className={`${location.pathname === link.path
                    ? 'text-white font-medium'
                    : 'text-white/60 hover:bg-white/10'
                    } py-5 px-5 flex items-center gap-3 transition-colors border-b border-white/20`}
                >
                  <span className='text-xl'>{link.icon}</span>
                  <span className='text-sm'>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Spacer */}
      <div className='grow'></div>

      {/* Logout Button */}
      <div className='px-5 pb-8 mt-auto'>
        <button
          onClick={handleLogout}
          className='bg-white cursor-pointer w-full py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-sm'
          style={{ color: '#1E6FFF' }}
        >
          <FiLogOut className='w-5 h-5' />
          <span className='font-medium text-sm'>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default SideBar