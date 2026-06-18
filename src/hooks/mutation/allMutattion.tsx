import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post_requests, put_request_with_image, put_requests } from "../helper/AxioHelper";




// ============== AUTH ===================
export const useLogin = () => {
    const login = useMutation({
        mutationFn: async (data: any) => {
            return post_requests(`teacher/login`, data, "")
        }
    })

    return login
}


export const useCreateSchoolStudent = () => {
    const queryClient = useQueryClient()

    const createSchoolStudent = useMutation({
        mutationFn: async (data: any) => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || ""
            return post_requests(`school/students`, data, token)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schoolStudents"] })
            queryClient.invalidateQueries({ queryKey: ["schoolsOverview"] })
        },
    })

    return createSchoolStudent
}

export const useUpdateSchoolProfile = () => {
    const queryClient = useQueryClient()
    const updateSchoolProfile = useMutation({
        mutationFn: async (data: any) => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || ""
            return put_request_with_image(`school/profile`, data, token)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schoolProfile"] })
        },
    })

    return updateSchoolProfile
}



export const useCreateSchoolTeachers = () => {
    const queryClient = useQueryClient()

    const createSchoolStudent = useMutation({
        mutationFn: async (data: any) => {
            const token = (await localStorage.getItem("wintriceTeacherToken")) || ""
            return post_requests(`school/teachers`, data, token)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schoolTeachers"] })
        },
    })

    return createSchoolStudent
}



export const useSuspendTeacher = () => {
    const queryClient = useQueryClient();

    const suspendTeacher = useMutation({
        mutationFn: async ({ teacherID, data }: { teacherID: string; data: any }) => {
            const token = localStorage.getItem("wintriceTeacherToken") || "";
            return put_requests(`school/teachers/${teacherID}/suspend`, data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schoolTeachers"] });
        },
    });

    return suspendTeacher;
};

// school / teachers / 6a320267c4d5dffb9d66a964 / suspend

