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

const INITIAL_STATE = {
  addingClass: false,
  addingClassError: '',
  addedClass: null,

  gettingClassById: false,
  gettingClassByIdError: '',
  rafClass: null,

  gettingLatestClassId: false,
  gettingLatestClassIdError: '',
  latestClassId: -1,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = INITIAL_STATE, action: Record<string, any>) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_CLASS_REQUEST: {
      return {
        ...state,
        addingClass: true,
        addingClassError: '',
      };
    }

    case ADD_CLASS_SUCCESS: {
      return {
        ...state,
        addingClass: false,
        addingClassError: '',
        addedClass: payload,
      };
    }

    case ADD_CLASS_FAILURE: {
      return {
        ...state,
        addingClass: false,
        addingClassError: payload,
      };
    }

    case GET_CLASS_BY_ID_REQUEST: {
      return {
        ...state,
        gettingClassById: true,
        gettingClassByIdError: '',
      };
    }

    case GET_CLASS_BY_ID_SUCCESS: {
      return {
        ...state,
        gettingClassById: false,
        gettingClassByIdError: '',
        rafClass: payload,
      };
    }

    case GET_CLASS_BY_ID_FAILURE: {
      return {
        ...state,
        gettingClassById: false,
        gettingClassByIdError: payload,
      };
    }

    case GET_LATEST_CLASS_ID_REQUEST: {
      return {
        ...state,
        gettingLatestClassId: true,
        gettingLatestClassIdError: '',
      };
    }

    case GET_LATEST_CLASS_ID_SUCCESS: {
      return {
        ...state,
        gettingLatestClassId: false,
        gettingLatestClassIdError: '',
        latestClassId: payload,
      };
    }

    case GET_LATEST_CLASS_ID_FAILURE: {
      return {
        ...state,
        gettingLatestClassId: false,
        gettingLatestClassIdError: payload,
      };
    }

    default:
      return state;
  }
};
