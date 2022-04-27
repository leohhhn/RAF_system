import { Dispatch } from 'redux';

import { addClass, getClassById, getLatestClassID } from '../../Services/projectService';

import {
  GET_CLASS_BY_ID_REQUEST,
  GET_CLASS_BY_ID_SUCCESS,
  GET_CLASS_BY_ID_FAILURE,

  GET_LATEST_CLASS_ID_FAILURE,
  GET_LATEST_CLASS_ID_REQUEST,
  GET_LATEST_CLASS_ID_SUCCESS,

  ADD_CLASS_REQUEST,
  ADD_CLASS_SUCCESS,
  ADD_CLASS_FAILURE,
} from '../ActionTypes/projectActionTypes';

export const getLatestClassIDAction = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: GET_LATEST_CLASS_ID_REQUEST });

    const payload = await getLatestClassID();

    dispatch({ type: GET_LATEST_CLASS_ID_SUCCESS, payload });
  } catch (err: any) {
    dispatch({ type: GET_LATEST_CLASS_ID_FAILURE, payload: err.message });
  }
};

export const getClassByIdAction = (id: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: GET_CLASS_BY_ID_REQUEST });

    const payload = await getClassById(id);

    dispatch({ type: GET_CLASS_BY_ID_SUCCESS, payload });
  } catch (err: any) {
    dispatch({ type: GET_CLASS_BY_ID_FAILURE, payload: err.message });
  }
};

export const addClassAction = (address: string, className: string, professorName: string, espb: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ADD_CLASS_REQUEST });

    const payload = await addClass(address, className, professorName, espb);

    dispatch({ type: ADD_CLASS_SUCCESS, payload });
  } catch (err: any) {
    dispatch({ type: ADD_CLASS_FAILURE, payload: err.message });
  }
};
