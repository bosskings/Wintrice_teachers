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
            return get_requests(`school/students/${studentId}`, token);
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


export const useGetSchoolQuiz = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["schoolQuiz"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("school/quizzes", token);
        },
    });

    return {
        schoolQuizData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};

export const useGetSchoolQuizChart = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["schoolQuizChart"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("school/quiz-chart", token);
        },
    });

    return {
        schoolQuizChartData: data,
        isLoading,
        isError,
        isFetched,
        refetch,
    };
};



export const useGetSchoolProfile = () => {
    const { data, isLoading, isError, isFetched, refetch } = useQuery({
        queryKey: ["schoolProfile"],
        queryFn: async () => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || "";
            return get_requests("school/profile", token);
        },
    });

    return {
        schoolProfile: data,
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