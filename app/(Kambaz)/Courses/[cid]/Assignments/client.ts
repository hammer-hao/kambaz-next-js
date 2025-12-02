"use client";

import axios from "axios";
import type { Assignment } from "./reducer";

const SERVER =
    process.env.NEXT_PUBLIC_HTTP_SERVER;

export const findAssignmentsForCourse = async (cid: string) => {
    const { data } = await axios.get<Assignment[]>(
        `${SERVER}/api/courses/${cid}/assignments`
    );
    return data;
};

export const findAssignmentById = async (aid: string) => {
    const { data } = await axios.get<Assignment>(`${SERVER}/api/assignments/${aid}`);
    return data;
};

export const createAssignment = async (
    cid: string,
    assignment: Assignment
) => {
    const { data } = await axios.post<Assignment>(
        `${SERVER}/api/courses/${cid}/assignments`,
        assignment
    );
    return data;
};

export const updateAssignmentOnServer = async (assignment: Assignment) => {
    const { data } = await axios.put<Assignment>(
        `${SERVER}/api/assignments/${assignment._id}`,
        assignment
    );
    return data;
};

export const deleteAssignmentOnServer = async (aid: string) => {
    await axios.delete(`${SERVER}/api/assignments/${aid}`);
};