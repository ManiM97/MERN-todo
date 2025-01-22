import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const getItems = () => {
    fetch(apiUrl + "/todo")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setTodos(res);
        }
      });
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleSubmit = () => {
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMessage("Item added successfully");
          } else {
            setError("Unable to create todo item");
          }
        })
        .catch(() => {
          setError("Unable to create todo item");
        });
    }
  };

  const handleUpdate = () => {
    // Update functionality logic
  };

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="text-center p-4 bg-primary text-white rounded">
        <h1>Todo Application</h1>
        <p>Stay organized and productive</p>
      </div>

      {/* Add Todo Section */}
      <div className="card my-4 shadow">
        <div className="card-body">
          <h3 className="card-title">Add New Task</h3>
          {message && <p className="text-success">{message}</p>}
          <div className="row g-2">
            <div className="col-md-5">
              <input
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className="form-control"
                type="text"
              />
            </div>
            <div className="col-md-5">
              <input
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="form-control"
                type="text"
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={handleSubmit}>
                Add Task
              </button>
            </div>
          </div>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>

      {/* Todo List Section */}
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-3">Task List</h3>
          <ul className="list-group">
            {todos.map((item, i) => (
              <li
                key={i}
                className="list-group-item d-flex align-items-center justify-content-between"
              >
                <div>
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <h5 className="mb-0">{item.title}</h5>
                      <p className="mb-0 text-muted">{item.description}</p>
                    </>
                  ) : (
                    <>
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control mb-2"
                        type="text"
                      />
                      <input
                        placeholder="Description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        className="form-control"
                        type="text"
                      />
                    </>
                  )}
                </div>
                <div>
                  {editId === -1 || editId !== item._id ? (
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
                  ) : (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  )}
                  <button className="btn btn-danger btn-sm">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
