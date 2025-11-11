"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as db from "./Database";

type Enrollment = { user: string; course: string };

type State = {
    enrollments: Enrollment[];
};

const initialState: State = {
    // Reset to DB seed on full reload (matches the spec)
    enrollments: [...db.enrollments],
};

const slice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enroll: (state, { payload }: PayloadAction<Enrollment>) => {
            const exists = state.enrollments.some(
                (e) => e.user === payload.user && e.course === payload.course
            );
            if (!exists) state.enrollments.push(payload);
        },
        unenroll: (state, { payload }: PayloadAction<Enrollment>) => {
            state.enrollments = state.enrollments.filter(
                (e) => !(e.user === payload.user && e.course === payload.course)
            );
        },
    },
});

export const { enroll, unenroll } = slice.actions;
export default slice.reducer;