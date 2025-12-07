import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const findUserEnrollments = async (userId: string | "current") => {
    console.log("finding enrollments for user:", userId)
    const { data } = await axiosWithCredentials.get(
        `${USERS_API}/${userId}/courses`,
        {withCredentials: true}
    );
    return data;
};

export const enroll = async (
    userId: string | "current",
    courseId: string,
) => {
    const { data } = await axiosWithCredentials.post(
        `${USERS_API}/${userId}/enrollments/${courseId}`,
    );
    return data;
};

export const unenroll = async (
    userId: string | "current",
    courseId: string,
) => {
    const { data } = await axiosWithCredentials.delete(
        `${USERS_API}/${userId}/enrollments/${courseId}`,
    );
    return data;
};