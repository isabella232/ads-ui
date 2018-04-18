import axios from "axios";

import { OpenSnackBar } from "../snackbar";

export const ADD_FLIGHT_DAYPARTING_START = "ADDFLIGHTDAYPARTINGSTART";
export const AddFlightDaypartingStart = (payload: any) => ({
  payload,
  type: ADD_FLIGHT_DAYPARTING_START,
});

export const ADD_FLIGHT_DAYPARTING_SUCCESSFUL = "ADDFLIGHTDAYPARTINGSUCCESSFUL";
export const AddFlightDaypartingSuccessful = (payload: any) => ({
  payload,
  type: ADD_FLIGHT_DAYPARTING_SUCCESSFUL,
});

export const ADD_FLIGHT_DAYPARTING_FAILD = "ADDFLIGHTDAYPARTINGFAILD";
export const AddFlightDaypartingFaild = (payload: any) => ({
  payload,
  type: ADD_FLIGHT_DAYPARTING_FAILD,
});

export const AddFlightDayparting = (flightID: string, user: any, dayparting: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(AddFlightDaypartingStart);
      const response = await axios.post(`http://localhost:4000/flight/${flightID}/dayparting`, dayparting, {
        headers: {
          "Authorization": `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      dispatch(AddFlightDaypartingSuccessful(response.data));
      dispatch(OpenSnackBar("Add Flight Dayparting Successfully"));
    } catch (error) {
      dispatch(AddFlightDaypartingFaild(error));
      if (error.response) {
        dispatch(OpenSnackBar(`Add Flight Dayparting Faild: ${error.response.data.message}`));
      } else if (error.request) {
        dispatch(OpenSnackBar(`Add Flight Dayparting Faild: Network Error`));
      } else {
        dispatch(OpenSnackBar(`Add Flight Dayparting Faild: ${error.message}`));
      }
    }
  };
};