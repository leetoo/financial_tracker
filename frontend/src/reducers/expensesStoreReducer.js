import { lensPath, set, over, filter, update as rUpdate, findIndex, pipe, prop, uniqBy } from 'ramda';

const ADD = 'EXPENSES:ADD';
const UPDATE = 'EXPENSES:UPDATE';
const DELETE = 'EXPENSES:DELETE';
const SET_EDITING_FOCUS = 'EXPENSES:SET_EDITING_FOCUS';
const SET_PAGE = 'EXPENSES:SET_PAGE';
const RESET_FORM = 'EXPENSES:RESET_FORM';
const UPDATE_FORM = 'EXPENSES:UPDATE_FORM';
const RESET_FILTERS = 'EXPENSES:RESET_FILTERS';
const UPDATE_FILTERS = 'EXPENSES:UPDATE_FILTERS';
const SET_LOADING = 'EXPENSES:SET_LOADING';
const SET_ERRORS = 'EXPENSES:SET_ERRORS';

const initialForm = () => ({
  occuredAt: '',
  amount: '0',
  description: '',
  comment: '',
});

const initialFilters = () => ({
  amountFrom: '',
  amountTo: '',
  text: '',
  dateFrom: '',
  dateTo: '',
});

export const initialState = {
  meta: {
    loading: false,
    errors: {},
  },
  filters: initialFilters(),
  editingFocus: null,
  form: initialForm(),
  page: 1,
  pageSize: 15,
  entities: {},
};

const loadingLens = lensPath(['meta', 'loading']);
const errorsLens = lensPath(['meta', 'errors']);
const formLens = lensPath(['form']);
const filtersLens = lensPath(['filters']);
const editingFocusLens = lensPath(['editingFocus']);
const pageLens = lensPath(['page']);
const expensesLens = userId => lensPath(['entities', userId]);

const add = (state, action) =>
  over(
    expensesLens(action.userId),
    expenses => uniqBy(prop('id'))([...(expenses || []), ...action.payload]),
    state,
  );

const update = (state, action) =>
  over(expensesLens(action.userId), (expenses) => {
    const index = findIndex(expense => expense.id === action.expenseId, expenses);
    return rUpdate(index, action.payload, expenses);
  }, state);

const delete1 = (state, action) =>
  over(expensesLens(action.userId), filter(expense => (expense.id !== action.expenseId)), state);

const setEditingFocus = (state, action) =>
  set(editingFocusLens, action.payload, state);

const setPage = (state, action) =>
  set(pageLens, action.payload, state);

const resetForm = pipe(
  set(formLens, initialForm()),
  set(errorsLens, {}),
);

const updateFilters = (state, action) =>
  over(filtersLens, filters => ({ ...filters, ...action.payload }), state);

const resetFilters = set(filtersLens, initialFilters());

const updateForm = (state, action) =>
  over(formLens, form => ({ ...form, ...action.payload }), state);

const setLoading = (state, action) => set(loadingLens, action.payload, state);
const setErrors = (state, action) => set(errorsLens, action.payload, state);

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      return add(state, action);
    case UPDATE:
      return update(state, action);
    case DELETE:
      return delete1(state, action);
    case SET_EDITING_FOCUS:
      return setEditingFocus(state, action);
    case SET_PAGE:
      return setPage(state, action);
    case RESET_FORM:
      return resetForm(state);
    case UPDATE_FORM:
      return updateForm(state, action);
    case RESET_FILTERS:
      return resetFilters(state, action);
    case UPDATE_FILTERS:
      return updateFilters(state, action);
    case SET_LOADING:
      return setLoading(state, action);
    case SET_ERRORS:
      return setErrors(state, action);
    default:
      return state;
  }
};

const addExpenses = (userId, payload) => ({ type: ADD, userId, payload });
const updateExpenses = (userId, expenseId, payload) =>
  ({ type: UPDATE, userId, expenseId, payload });
const deleteExpenses = (userId, expenseId) => ({ type: DELETE, userId, expenseId });
const setEditingFocusExpenses = expenseId => ({ type: SET_EDITING_FOCUS, payload: expenseId });
const updateFiltersExpenses = payload => ({ type: UPDATE_FILTERS, payload });
const resetFiltersExpenses = () => ({ type: RESET_FILTERS });
const resetFormExpenses = () => ({ type: RESET_FORM });
const updateFormExpenses = payload => ({ type: UPDATE_FORM, payload });
const setPageExpenses = payload => ({ type: SET_PAGE, payload });
const setLoadingExpenses = payload => ({ type: SET_LOADING, payload });
const setErrorsExpenses = payload => ({ type: SET_ERRORS, payload });

export const actions = {
  addExpenses,
  updateExpenses,
  deleteExpenses,
  setEditingFocusExpenses,
  updateFiltersExpenses,
  resetFiltersExpenses,
  resetFormExpenses,
  updateFormExpenses,
  setPageExpenses,
  setLoadingExpenses,
  setErrorsExpenses,
};
