import { useQuery } from "@tanstack/react-query";
import { get_requests } from "../helper/AxioHelper";


export const useGetTeachersOverview = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["teachersOverview"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("teacher/overview", token);
        },
    });

    return {
        teacherOverviewData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export const useGetTeachersStudents = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["teacherStudents"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("teacher/students", token);
        },
    });

    return {
        teacherStudentsData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export const useGetStudentDetails = (studentId: string) => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["studentDetails", studentId],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests(`teacher/students/${studentId}`, token);
        },
        enabled: !!studentId,
    });

    return {
        studentDetailsData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
}

export const useGetTeacherCourses = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["teacherCourses"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("teacher/courses", token);
        },
    });

    return {
        teacherCoursesData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetTeacherQuizzes = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["teacherQuizzes"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("teacher/quizzes", token);
        },
    });

    return {
        teacherQuizData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};


export const useGetTeacherProfile = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["teacherProfile"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("teacher/settings", token);
        },
    });

    return {
        teacherProfiile: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};



// ============= SCHOOL TEACHERS ENDPOINT GET ================
export const useGetSchoolTeachers = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["schoolTeachers"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("school/teachers", token);
        },
    });

    return {
        schoolTeachers: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};