import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import taskReducer from "../features/taskSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer
    }
});
