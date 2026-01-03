import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to get headers
const getConfig = (getState) => {
    const token = getState().auth.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { getState, rejectWithValue }) => {
    try {
        const response = await axios.get("https://todo-task-giuw.onrender.com/api/tasks", getConfig(getState));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { getState, rejectWithValue }) => {
    try {
        const response = await axios.post("https://todo-task-giuw.onrender.com/api/tasks", taskData, getConfig(getState));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, data }, { getState, rejectWithValue }) => {
    try {
        const response = await axios.put(`https://todo-task-giuw.onrender.com/api/tasks/${id}`, data, getConfig(getState));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, { getState, rejectWithValue }) => {
    try {
        await axios.delete(`https://todo-task-giuw.onrender.com/api/tasks/${id}`, getConfig(getState));
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.list = state.list.filter(t => t.id !== action.payload);
            });
    }
});

export default taskSlice.reducer;
