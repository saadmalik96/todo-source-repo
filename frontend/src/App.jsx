import React, { useEffect, useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL + '/api' || "/api";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${apiUrl}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!newTask) return;
    try {
      const res = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask })
      });
      if (res.ok) {
        setNewTask("");
        fetchTodos();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const res = await fetch(`${apiUrl}/todos${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      if (res.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>My Todo List</h1>
      <input 
        type="text" 
        placeholder="New Task" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ margin: "0.5rem 0", display: "flex", alignItems: "center" }}>
            <span 
              onClick={() => toggleTodo(todo)}
              style={{ 
                textDecoration: todo.completed ? "line-through" : "none", 
                cursor: "pointer", 
                flex: 1 
              }}
            >
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
