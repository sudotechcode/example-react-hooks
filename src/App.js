import React, { useReducer, useContext, useEffect, useRef } from 'react';

const ContextApp = React.createContext();

function appReducer(state, action) {
  switch (action.type) {
    case 'reset-item': {
      return action.payload
    }
    case 'add-item': {
      return [
        ...state,
        {
          id: Date.now(),
          text: '',
          completed: false
        }
      ]
    }
    case 'delete-item': {
      return state.filter(item => item.id !== action.payload )
    }
    case 'completed-item': {
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed
          }
        }
        return item
      })
    }
    case 'change-item-text': {
      return state.map(item => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            text: action.payload.text
          }
        }
        return item
      })
    }
    default: {
      return state
    }
  }
}

function TodoList({ items }) {
  return items.map(item =>  <TodoItem key={item.id} {...item} /> )
}

function TodoItem({ id, completed, text }) {
  const dispatch = useContext(ContextApp)
  return <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <input type="checkbox" checked={completed} onChange={() => dispatch({ type: 'completed-item', payload: id })} />
            <input type="text" defaultValue={text} />
            <button onClick={() => dispatch({ type: 'delete-item', payload: id })}>Delete</button>
          </div>
}

// same effect
function useEffectOnce(callback) {
  const didRun = useRef(false)

  useEffect(() => {
    if (!didRun.current) {
      callback()
      didRun.current = true
    }
  })
}

function TodosApp() {
  const [state, dispatch] = useReducer(appReducer, [])

  useEffectOnce(() => {
    const rawData = localStorage.getItem('data');
    dispatch({ type: 'reset-item', payload: JSON.parse(rawData) })
  })

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(state))
  }, [state])

  return (
    <ContextApp.Provider value={dispatch}>
      <div className="container">
        <h1>Todos App</h1>
        <button onClick={() => dispatch({ type: 'add-item' })}>Create New</button>
        <br />
        <br />
        {/* we will useContext */}
        <TodoList items={state} />
      </div>
    </ContextApp.Provider>
  );
}

export default TodosApp;
