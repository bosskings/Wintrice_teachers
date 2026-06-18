import { useGetTeacherCourses } from "../hooks/queries/allQueries"

const Courses = () => {
    const { teacherCoursesData, isLoading } = useGetTeacherCourses()
    console.log('This is Teachers', teacherCoursesData)
    return (
        <div>

        </div>
    )
}

export default Courses
