import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const apiUrl = "http://localhost:2799";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(`${apiUrl}/todo`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch todos");
        }
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => setError("Failed to load todos"));
  };

  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(`${apiUrl}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          setTodos([...todos, { title, description }]);
          // setMessage("Task added successfully");
          toast.success("Task added successfully");
          setTitle("");
          setDescription("");
        })
        .catch(() => toast.error("Unable to create task"));
    }
  };

  const handleUpdate = (id) => {
    fetch(`${apiUrl}/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === id
              ? { ...todo, title: editTitle, description: editDescription }
              : todo
          )
        );
        setEditId(-1);
        toast.success("Task updated successfully");
      })
      .catch(() => toast.error("Unable to update task"));
  };

  const handleDelete = (id) => {
    fetch(`${apiUrl}/todo/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error();
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
        toast.success("Task deleted successfully");
      })
      .catch(() => toast.error("Unable to delete task"));
  };

  return (
    <div className="container my-5">
      <div className="text-center p-4 bg-primary text-white rounded">
        <h1>Todo Application</h1>
        <p>Stay organized and productive</p>
      </div>

      <div className="card my-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Add New Task</h3>          
          {error && <p className="text-danger">{error}</p>}
          <div className="row g-2">
            <div className="col-md-5">
              <input
                placeholder="Title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <input
                placeholder="Description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={handleSubmit}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">Task List</h3>
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editId === item._id ? (
                  <div className="row g-2 flex-grow-1">
                    <div className="col-md-5">
                      <input
                        className="form-control"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        className="form-control"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h5 className="mb-0">{item.title}</h5>
                    <p className="mb-0 text-muted">{item.description}</p>
                  </div>
                )}
                <div>
                  {editId === item._id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleUpdate(item._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditId(-1)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditId(item._id);
                          setEditTitle(item.title);
                          setEditDescription(item.description);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
