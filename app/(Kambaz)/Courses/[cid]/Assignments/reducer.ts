"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type Assignment = {
    _id: string;
    title: string;
    description?: string;
    points: number;
    due?: string;
    notAvailableUntil?: string;
    availableUntil?: string;
    course: string;
};

type State = {
    assignments: Assignment[];
};

const initialState: State = {
    assignments: [],
};

const slice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, { payload }: PayloadAction<Assignment[]>) => {
            state.assignments = payload;
        },
        addAssignment: (state, { payload }: PayloadAction<Assignment>) => {
            state.assignments.unshift(payload);
        },
        updateAssignment: (state, { payload }: PayloadAction<Assignment>) => {
            const i = state.assignments.findIndex((a) => a._id === payload._id);
            if (i >= 0) state.assignments[i] = payload;
        },
        deleteAssignment: (state, { payload }: PayloadAction<string>) => {
            state.assignments = state.assignments.filter((a) => a._id !== payload);
        },
    },
});

export const { setAssignments, addAssignment, updateAssignment, deleteAssignment } =
    slice.actions;
export default slice.reducer;