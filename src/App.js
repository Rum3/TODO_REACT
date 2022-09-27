import React, { useEffect,useState } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoItem from "./components/TodoItem";


function App() {
  const [todos, setTodos] = useState([]);
  let url = 'http://localhost:5000/todos';

    

  const fetchTodos = ()=>{
  fetch(url)
    .then(r=>{
      if(r.ok){
        return r.json()
      }
    })
    .then(data=> {
      setTodos(data)
    })
    .catch( err=>console.warn(err) );
  }



  const addTodo = (text) => {
    let todo = {
      id: new Date().getTime().toString(), 
      text: text, 
      completed: false, 
    }

    fetch(url, {
      method:"Post",
      body:JSON.stringify(todo),
      headers:{
          "content-type":"application/json"
      }
  })
  .then(res=>{
      if(res.ok){
          return res.json()
      }
  })
  .then(todo=>{
      setTodos([...todos,todo])
  })    
  
  };

  const removeTodo = (id) => {
    let updatedTodos = todos.filter((todo) => todo.id !== id);
    console.log(id);

    fetch(url+"/"+id, {
      method:"Delete",
      body:JSON.stringify(updatedTodos),
      headers:{
          "content-type":"application/json"
      }
  })
  .then(res=>{
      if(res.ok){
          return res.json()
      }
  })
  .then(todo=>{
      setTodos([...updatedTodos])
  })    
   
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.filter((todo) => todo.id === id)[0]
   
    fetch(url+"/"+id, {
      method:"PATCH",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        completed:!updatedTodos.completed,
      }),
  })
  .then(res=>{
      if(res.ok){
          return res.json()
      }
  })
  .then(data=>{
    setTodos(todos.map(todo=>todo.id===id?data:todo));
  })    
  }

 


  let sortedTodos = todos.sort((a, b) => b.important - a.important)

  useEffect(fetchTodos,[])

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <hr className="seperator"/>
      {sortedTodos.map((todo) => {
        return (
          <TodoItem removeTodo={removeTodo} completeTodo={completeTodo} todo={todo} key={todo.id}/>
        )
      })}
    </div>
  );
}

export default App;