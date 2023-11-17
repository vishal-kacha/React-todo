import { useEffect, useState } from "react";
import deletesvg from "./assets/delete.svg";

function App() {
  const [input, setInput] = useState("");
  const [todo, setTodo] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  let userid = localStorage.getItem('userid');

  useEffect(() => {
    if (!userid) {
      createUser();
    } else {
      fecthTodo();
    }
  }, []);

  async function createUser() {
    const res = await fetch('/.netlify/functions/api', {
      method: 'PUT',
    });
    const response = await res.json();
    const usr = response.usr;
    localStorage.setItem('userid', usr)
  }

  async function fecthTodo() {
    const res = await fetch(`/.netlify/functions/api?userid=${userid}`,);
    const response = await res.json();
    const databaseresult = response[0];
    let todofromdata = databaseresult.savedTodo;
    setTodo([...todofromdata]);
  }

  async function SaveTododata(params) {
    const usertodo = [...todo, params]
    const response = await fetch(`/.netlify/functions/api?userid=${userid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usertodo)
    });
  }

  async function RemoveData(params) {
    await fetch(`/.netlify/functions/api?userid=${userid}`, {
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
        <form onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}>
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
          <button>Add Todo</button>
        </form>

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
