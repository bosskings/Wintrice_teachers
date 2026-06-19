import { FaGraduationCap } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { SiCoursera } from "react-icons/si";
import { TbLayoutDashboard } from "react-icons/tb";


export const navigationLink = [
    {
        id: 1,
        name: 'Overview',
        path: '/overview',
        icon: <TbLayoutDashboard />
    },

    {
        id: 2,
        name: 'Students',
        path: '/students',
        icon: <FaGraduationCap />
    },

    {
        id: 3,
        name: 'Courses',
        path: '/courses',
        icon: <SiCoursera />
    },

    {
        id: 4,
        name: 'Quizzes',
        path: '/quizzes',
        icon: <PiExam />
    },

    {
        id: 5,
        name: 'Settings',
        path: '/profile',
        icon: <IoSettingsOutline />
    },

    {
        id: 6,
        name: 'Password',
        path: '/password',
        icon: <MdPassword />
    },
]


