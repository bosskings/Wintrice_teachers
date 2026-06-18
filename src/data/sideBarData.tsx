import { FaGraduationCap } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLayoutDashboard } from "react-icons/tb";


export const navigationLink = [
    {
        id: 1,
        name: 'Overview',
        path: '/overview',
        icon: <TbLayoutDashboard />
    },

    {
        id: 3,
        name: 'Teachers',
        path: '/teachers',
        icon: <FaGraduationCap />
    },
    {
        id: 2,
        name: 'Settings',
        path: '/settings/school-profile',
        icon: <IoSettingsOutline />
    },
]


