import React, { useEffect, useState } from "react";
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

  const API = "http://localhost:8000/todos";

  // ================= GET TODOS =================
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API);
      setTodos(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load todos");
    }
  };

  useEffect(() => {
    fetchTodos();
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
          Apple Style MERN Stack Todo App
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
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      style={styles.editInput}
                    />

                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) =>
                        setEditDescription(e.target.value)
                      }
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
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f7",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    background: "#ffffff",
    borderRadius: "30px",
    padding: "35px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #ececec",
  },

  heading: {
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "700",
    color: "#1d1d1f",
    marginBottom: "8px",
  },

  subText: {
    textAlign: "center",
    color: "#6e6e73",
    marginBottom: "30px",
    fontSize: "15px",
  },

  form: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "180px",
    height: "52px",
    borderRadius: "16px",
    border: "1px solid #d2d2d7",
    padding: "0 16px",
    fontSize: "15px",
    background: "#fbfbfd",
    outline: "none",
  },

  button: {
    height: "52px",
    padding: "0 24px",
    border: "none",
    borderRadius: "16px",
    background: "#0071e3",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  todoCard: {
    background: "#fbfbfd",
    border: "1px solid #ececec",
    borderRadius: "20px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    background: "#f2f2f2",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteBtn: {
    background: "#ff3b30",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  saveBtn: {
    background: "#34c759",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  cancelBtn: {
    background: "#8e8e93",
    border: "none",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
  },

  editContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  editInput: {
    height: "48px",
    borderRadius: "14px",
    border: "1px solid #d2d2d7",
    padding: "0 14px",
    fontSize: "15px",
    background: "#fff",
    outline: "none",
  },

  error: {
    background: "#fff2f0",
    color: "#d70015",
    padding: "12px",
    borderRadius: "14px",
    textAlign: "center",
    marginBottom: "18px",
  },

  emptyText: {
    textAlign: "center",
    color: "#86868b",
    fontSize: "15px",
  },
};