import { handleActions } from 'redux-actions';
import { getContactListAction, getContactPlanAction } from 'src/actions';
import { IContactStore } from 'src/interfaces/store';

type S = IContactStore;

const initialState: IContactStore = {
  data: [],
  plan: {
    count: '',
    expected: ''
  }
};

export const contactReducer = handleActions(
  {
    [`${getContactListAction}`]: (state: S, { payload }) => ({
      ...state,
      ...payload
    }),
    [`${getContactPlanAction}`]: (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState
);
