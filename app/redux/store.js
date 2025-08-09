import { configureStore } from "@reduxjs/toolkit";
import driverReducer from "./reducers/driver.slice";
const store = configureStore({
  reducer: {
    user: driverReducer,
  },
  //   middleware :
});

export default store;
