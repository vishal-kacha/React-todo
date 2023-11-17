import { useEffect, useState } from "react";
import deletesvg from "./assets/delete.svg";

function App() {
  const [input, setInput] = useState("");
  const [todo, setTodo] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fecthTodo();
  }, []);

  async function fecthTodo() {
    const res = await fetch("/.netlify/functions/api");
    const response = await res.json();
    const databaseresult = response[1];
    let todofromdata = databaseresult.savedTodo;
    setTodo([...todo, ...todofromdata])
  }

  async function SaveTododata(params) {
    const usertodo = [...todo, params]
    const response = await fetch("/.netlify/functions/api", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usertodo)
    });

  }

  async function RemoveData(params) {
     await fetch("/.netlify/functions/api", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

  }

  function addTodo() {
    if (input.length == 0) {
      setShowTooltip(true);
      return;
    } else {
      setTodo([...todo, input]);
      setInput("");
      setShowTooltip(false);
      SaveTododata(input);
    }
  }

  function deleteTodo(index) {
    const newTodo = [...todo];
    newTodo.splice(index, 1);
    setTodo(newTodo);
    RemoveData(newTodo);
  }

  return (
    <>
      <div className="main">
        <h1>Todo app</h1>
        <input
          type="text"
          name="todoinput"
          id="todoinput"
          placeholder="Enter your Todo's"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button onClick={addTodo}>Add Todo</button>

        {showTooltip && (
          <div
            style={{ color: "red", position: "absolute", margin: "0.3rem 0" }}
          >
            Please enter a todo
          </div>
        )}

        <ol>
          {todo.map((item, index) => (
            <li key={index}>
              <div>
                <input type="checkbox" name="" id="" />
                <label htmlFor="">{item}</label>
              </div>
              <button
                className="delete-button"
                onClick={() => deleteTodo(item)}
              >
                <img src={deletesvg} alt="" />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default App;
