import { scan, shareReplay, startWith, Subject } from 'rxjs';

const pre = document.querySelector('pre');

const initialState = {
  counter: 0,
};

const handlers = {
  'INCREMENT': (state) => ({ ...state, counter: state.counter + 1 }),
  'DECREMENT': (state) => ({ ...state, counter: state.counter - 1 }),
  'ADD': (state, action) => ({ ...state, counter: state.counter + action.payload }),
  'DEFAULT': (state) => state,
}

const reducer = (state = initialState, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT;
  return handler(state, action)
};

const createStore = (rootReducer) => {
  const subject$ = new Subject();
  const store$ = subject$.pipe(
    startWith({ type: '__INIT__'}),
    scan(rootReducer, undefined),
    shareReplay(1),
    );

  store$.dispatch = (action) => subject$.next(action);

  return store$;
};

const store$ = createStore(reducer);

store$.subscribe((state) => {
  pre.innerHTML = JSON.stringify(state, null, 2);
});

document.getElementById('increment').addEventListener('click', () => {
  store$.dispatch({ type: 'INCREMENT' });
});

document.getElementById('decrement').addEventListener('click', () => {
  store$.dispatch({ type: 'DECREMENT' });
});

document.getElementById('add').addEventListener('click', () => {
  store$.dispatch({ type: 'ADD', payload: 10 });
});
