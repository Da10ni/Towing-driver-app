import { createSlice } from "@reduxjs/toolkit";

type Location = {
  latitude: number;
  longitude: number;
};
type InitialState = {
  geohash: string | null;
  location: Location | null;
  phoneNumber: string | null;
  status: boolean | null;
  timestamps: number | null;
};

const initialState: InitialState = {
  geohash: null,
  location: null,
  phoneNumber: null,
  status: null,
  timestamps: null,
};

const driverSlice = createSlice({
  name: "driver",
  initialState: initialState,
  reducers: {
    setValueIndriverState: (state: any, action: any) => {
      const data = action.payload;
      const nameOfState = data?.name;
      const value = data?.data;
      state[nameOfState] = value;
    },
  },
});

export const { setValueIndriverState } = driverSlice.actions;
export default driverSlice.reducer;
