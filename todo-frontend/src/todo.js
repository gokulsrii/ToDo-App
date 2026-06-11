import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  // EDIT STATES
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const API = `${process.env.REACT_APP_API_URL}/todos`;

  // ================= GET TODOS =================
 const fetchTodos = useCallback(async () => {
  try {
    const res = await axios.get(API);
    setTodos(res.data);
  } catch (err) {
    console.log(err);
    setError("Failed to load todos");
  }
}, [API]);

useEffect(() => {
  fetchTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // ================= VALIDATION =================
  const validate = () => {
    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    return null;
  };

  // ================= CREATE TODO =================
  const addTodo = async (e) => {
    e.preventDefault();

    const errMsg = validate();

    if (errMsg) {
      setError(errMsg);
      return;
    }

    try {
      const res = await axios.post(API, {
        title,
        description,
      });

      setTodos([res.data, ...todos]);

      setTitle("");
      setDescription("");
      setError("");
    } catch (err) {
      console.log(err);
      setError("Error creating todo");
    }
  };

  // ================= DELETE TODO =================
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= TOGGLE COMPLETE =================
  const toggleTodo = async (todo) => {
    try {
      const res = await axios.put(`${API}/${todo._id}`, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(
        todos.map((t) => (t._id === todo._id ? res.data : t))
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= START EDIT =================
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  // ================= UPDATE TODO =================
  const updateTodo = async (id) => {
    if (!editTitle.trim() || !editDescription.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.put(`${API}/${id}`, {
        title: editTitle,
        description: editDescription,
      });

      setTodos(
        todos.map((t) => (t._id === id ? res.data : t))
      );

      setEditingId(null);
      setEditTitle("");
      setEditDescription("");
      setError("");
    } catch (err) {
      console.log(err);
      setError("Error updating todo");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>ToDo List</h1>

        <p style={styles.subText}>
          Responsive Todo Management System
        </p>

        {/* ERROR */}
        {error && <div style={styles.error}>{error}</div>}

        {/* FORM */}
        <form onSubmit={addTodo} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Add
          </button>
        </form>

        {/* TODO LIST */}
        {/* TODO LIST */}
<div style={styles.taskContainer}>
  <div style={styles.taskHeader}>
    My Tasks ({todos.length})
  </div>

  <div style={styles.list}>
    {todos.length === 0 ? (
      <p style={styles.emptyText}>No tasks available</p>
    ) : (
      todos.map((todo) => (
        <div key={todo._id} style={styles.todoCard}>
          {editingId === todo._id ? (
            <div style={styles.editContainer}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={styles.editInput}
              />

              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                style={styles.editInput}
              />

              <div style={styles.actions}>
                <button
                  onClick={() => updateTodo(todo._id)}
                  style={styles.saveBtn}
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                onClick={() => toggleTodo(todo)}
                style={{ flex: 1, cursor: "pointer" }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    color: "#1d1d1f",
                    textDecoration: todo.completed
                      ? "line-through"
                      : "none",
                    opacity: todo.completed ? 0.5 : 1,
                  }}
                >
                  {todo.title}
                </h3>

                <p
                  style={{
                    marginTop: "6px",
                    color: "#6e6e73",
                    fontSize: "14px",
                    textDecoration: todo.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {todo.description}
                </p>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() => startEdit(todo)}
                  style={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTodo(todo._id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))
    )}
  </div>
</div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */



const styles = {
  container: {
    minHeight: "100vh",
    background: "#f2f2f7",
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    marginTop: "30px",
  },

  heading: {
    fontSize: "38px",
    fontWeight: "700",
    color: "#000",
    marginBottom: "6px",
  },

  subText: {
    color: "#8e8e93",
    fontSize: "15px",
    marginBottom: "25px",
  },

  form: {
    background: "#fff",
    borderRadius: "20px",
    padding: "16px",
    marginBottom: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },

  input: {
    width: "100%",
    height: "48px",
    border: "none",
    borderBottom: "1px solid #e5e5ea",
    padding: "0 12px",
    fontSize: "16px",
    outline: "none",
    background: "transparent",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "14px",
    background: "#007aff",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  todoCard: {
  background: "#fff",
  padding: "8px 12px",
  borderBottom: "1px solid #f2f2f7",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},

  todoContent: {
    flex: 1,
  },

  todoTitle: {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1d1d1f",
  margin: "0",
},


  todoDesc: {
  fontSize: "12px",
  color: "#8e8e93",
  marginTop: "2px",
  marginBottom: "0",
},

 actions: {
  display: "flex",
  gap: "5px",
},

editBtn: {
  padding: "6px 10px",
  fontSize: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#f2f2f7",
  color: "#007aff",
  cursor: "pointer",
},

deleteBtn: {
  padding: "6px 10px",
  fontSize: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#ff3b30",
  color: "#fff",
  cursor: "pointer",
},

  saveBtn: {
    background: "#34c759",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#8e8e93",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  error: {
    background: "#fff2f2",
    color: "#ff3b30",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "15px",
    textAlign: "center",
  },

  emptyText: {
    textAlign: "center",
    color: "#8e8e93",
    marginTop: "20px",
  },

  // task box 
  taskContainer: {
  background: "#ffffff",
  borderRadius: "24px",
  padding: "18px",
  marginTop: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
},

taskHeader: {
  fontSize: "20px",
  fontWeight: "700",
  color: "#1d1d1f",
  marginBottom: "15px",
},

};