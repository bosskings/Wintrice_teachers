
const Navbar = () => {

  const teacher: any = localStorage.getItem('teacher')
  const loginTeacher = JSON.parse(teacher)
  // console.log('This is teacher', loginTeacher)

  return (
    <div className=' bg-white  text-black fixed top-0 left-60 right-0 z-10'>
      <div className='flex items-center h-20 justify-between gap-6 w-full px-0 max-w-6xl my-auto'>

        <div className='flex items-center gap-4 shrink-0 ml-auto'>
          <div className='flex items-center gap-3 ml-auto cursor-pointer'>

            <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium'>
              {loginTeacher?.firstName ? loginTeacher.firstName.charAt(0).toUpperCase() : '--'}
            </div>

            <div className='min-w-max'>
              <p className='text-sm font-medium text-gray-800'>{loginTeacher?.firstName || '--'} {loginTeacher?.lastName || '--'}</p>
              <p className='text-xs text-gray-500'>{loginTeacher?.email || '--'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar