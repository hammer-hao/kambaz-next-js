"use client";

import axios from "axios";
import type { Assignment } from "./reducer";

const SERVER =
    process.env.NEXT_PUBLIC_HTTP_SERVER;

export const findAssignmentsForCourse = async (cid: string) => {
    const { data } = await axios.get<Assignment[]>(
        `${SERVER}/courses/${cid}/assignments`
    );
    return data;
};

export const findAssignmentById = async (aid: string) => {
    const { data } = await axios.get<Assignment>(`${SERVER}/assignments/${aid}`);
    return data;
};

export const createAssignment = async (
    cid: string,
    assignment: Assignment
) => {
    const { data } = await axios.post<Assignment>(
        `${SERVER}/courses/${cid}/assignments`,
        assignment
    );
    return data;
};

export const updateAssignmentOnServer = async (assignment: Assignment) => {
    const { data } = await axios.put<Assignment>(
        `${SERVER}/assignments/${assignment._id}`,
        assignment
    );
    return data;
};

export const deleteAssignmentOnServer = async (aid: string) => {
    await axios.delete(`${SERVER}/assignments/${aid}`);
};