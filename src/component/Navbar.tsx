import { useGetSchoolProfile } from '../hooks/queries/allQueries';
import LoadingOverlay from './LoadingOverlay';

const Navbar = () => {

  const { schoolProfile, isLoading } = useGetSchoolProfile()
  const schoolData = schoolProfile?.data?.school
  return (
    <div className=' bg-white  text-black fixed top-0 left-60 right-0 z-10'>
      <LoadingOverlay visible={isLoading} />
      <div className='flex items-center h-20 justify-between gap-6 w-full px-0 max-w-6xl my-auto'>

        <div className='flex items-center gap-4 shrink-0 ml-auto'>

          {/* User Profile */}
          <div className='flex items-center gap-3 ml-auto cursor-pointer'>
            {
              schoolData?.schoolLogo ? (
                <img
                  src={schoolData?.schoolLogo}
                  alt="Profile"
                  className='w-10 h-10 rounded-full object-cover'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium'>
                  {schoolData?.name ? schoolData.name.charAt(0).toUpperCase() : '--'}
                </div>
              )
            }
            <div className='min-w-max'>
              <p className='text-sm font-medium text-gray-800'>{schoolData?.name || '--'}</p>
              <p className='text-xs text-gray-500'>{schoolData?.email || '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar