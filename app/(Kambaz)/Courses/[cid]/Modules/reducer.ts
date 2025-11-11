import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../../Database";

import { v4 as uuidv4 } from "uuid";
const initialState = {
    modules: modules,
};
const modulesSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        addModule: (state, { payload: module }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newModule: any = {
                _id: uuidv4(),
                lessons: [],
                name: module.name,
                course: module.course,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.modules = [...state.modules, newModule] as any;
        },
        deleteModule: (state, { payload: moduleId }) => {
            state.modules = state.modules.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (m: any) => m._id !== moduleId);
        },
        updateModule: (state, { payload: module }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.modules = state.modules.map((m: any) =>
                m._id === module._id ? module : m
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;
        },
        editModule: (state, { payload: moduleId }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state.modules = state.modules.map((m: any) =>
                m._id === moduleId ? { ...m, editing: true } : m
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;
        },
    },
});
export const { addModule, deleteModule, updateModule, editModule } =
    modulesSlice.actions;
export default modulesSlice.reducer;

