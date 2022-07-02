import React, { Component, useState } from 'react';
import './App.css';

var _ = require('lodash');

var list_of_todo_lists = JSON.parse(localStorage.getItem("lists") || "[]");
var todoList = JSON.parse(localStorage.getItem("todoList") || "[]");
var todoList2 = JSON.parse(localStorage.getItem("todoList2") || "[]");
var displayAll = false

for (let i = 0; i < todoList.length; i++) {
  if (todoList[i].deleted == true) {
    todoList.splice(i, 1);
  }}

class Todo {
  constructor(name, description, priority, list) {
  this.idee = Date.now()
  this.date = new Date();

  this.done = false;
  this.deleted = false;

  this.name = name;
  this.description = description; //Todo: Add support for sub lists and stuff
  this.priority = priority;
  this.list = list;

  todoList.push(this)
  localStorage.setItem(todoList, JSON.stringify(this.list));
  console.log("ID is " + this.idee)
  }
}

if (todoList == []) {
  const placeholder1 = new Todo("Wash Dishes", "Ya gotta soap them and rinse them and all that", 2)
  const placeholder2 = new Todo("Walk Dog", "Ya gotta soap them and rinse them and all that", 2)
  const placeholder3 = new Todo("Eat Cheese", "Ya gotta soap them and rinse them and all that", 2, true)
}



class TodoCard extends React.Component {
constructor (props) {
  super(props);

  this.toggledone = this.toggledone.bind(this);
  this.expand = this.expand.bind(this);
  this.collapse = this.collapse.bind(this);
  this.remove = this.remove.bind(this);
  this.refresh = this.props.refresh.bind(this);

  this.state = {
    todo: this.props.todo,
    expand: false,
  };
}


 remove() {
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].idee == this.state.todo.idee) {
      console.log("deleted " + todoList[i].name)

        //Q: Why is this a toggle???
      if (todoList[i].deleted == true) {
        todoList[i].deleted = false;
      } else {
        todoList[i].deleted = true;
      }

      localStorage.setItem("todoList", JSON.stringify(todoList))
      this.props.refresh()
      break;
    }
  }
}

 expand() {
   this.setState({expand: true});
  // document.getElementById(this.props.todo.idee).scrollIntoView({behavior: "smooth"});
}

collapse() {
  this.setState({expand: false});
}

toggledone() {
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].idee == this.state.todo.idee) {
      console.log("toggle " + todoList[i].name)

      if (todoList[i].done == true) {
        todoList[i].done = false;
      } else {
        todoList[i].done = true;
      }

      localStorage.setItem("todoList", JSON.stringify(todoList))
      this.props.refresh()
      break;
    }
  }
}

 render() {
  const {name, description, priority, done, date, idee} = this.state.todo;
  const expand = this.state.expand;

  let stringArray = (date.toString()).split("");   // spliting string into array of characters
  let displayDate = stringArray.slice(0, 10).join("")

  if (expand == false) {
   return (
     <div className='todoCard'id={idee} >
       <div className="todoTopBar" >
        <div className={ done ? 'done-button done' : 'done-button notdone' } onClick={ ()=>this.toggledone()}></div>
        <div className="todo-card-title" onClick= {this.expand}>{name}</div>
       </div>
     </div>
   )} else {
    return (
      <div className='todoCard' id={idee}>
      <div className="todoTopBar" >
      <div className={ done ? 'done-button done' : 'done-button notdone' } onClick={ ()=>this.toggledone()}></div>
      <div className="todo-card-line todo-card-title" onClick={this.collapse}>{name}</div>
      </div>
      <div className='todo-card-line todo-card-description'>{description}</div>
      <div className='todo-card-line todo-card-priority'>{priority} Priority</div>
      <div className='todo-card-line todo-card-date-created'>{displayDate}</div>
      <span id="removeTodo" onClick={ ()=>this.remove()} className="btn delete-todo">DELETE</span>
    </div>
   )}
 }
}

class NewTodoExpansion extends React.Component {

  render() {
    return (
      <div new-todo-expanded>

        <div className="new-todo-row">
         <label htmlFor="entry-description">Description: </label>
         <input type="text" id="entry-description" />
        </div>

        <div className="new-todo-row">
         <label htmlFor="entry-description">Deadline: </label>
         <input type="date" id="new-todo-deadline" name="new-todo-deadline"  />
        </div>
    
      <div className="new-todo-row">     
        <input type="radio" name="Priority" id="Low" value="Low"/>
        <label htmlFor="Low">Low</label>

        <input type="radio" name="Priority" id="Medium"  value="Medium" checked/>
        <label htmlFor="Medium">Medium</label>

        <input type="radio" name="Priority" id="High" value ="High" />
        <label htmlFor="High">High</label>
      </div>

      </div>

    )
  }
}

class NewTodo extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      expand: false
    };

    this.addItem = this.props.addItem.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.addHandle = this.addHandle.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
}

expand() {
   this.setState({expand: true});
}

collapse() {
  this.setState({expand: false});
}

addHandle() {
  this.addItem()
  this.collapse()
}

handleEnter(e) {
  var key = e.key
  if (key == "Enter") {
    this.addHandle()
  }
}

render() {

  if (this.state.expand == false ) {
  return (
    <div className="newtodo">
      <input name="title" type="text" id="entry" onFocus={this.expand} placeholder="+ Add a card" />
    </div>
  )} else {
    return (
      <div className="newtodo" onKeyPress={(e) => this.handleEnter(e)}>
            <div className="new-todo-row">
              {/* <label htmlFor="title">Title: </label> */}
              <input name="title" type="text" id="entry" placeholder='Please enter title...' autoFocus />
            </div>
            
              <div className="new-todo-row">
              {/* <label htmlFor="entry-description">Description: </label> */}
              <input type="textarea" id="entry-description" placeholder='Please enter description...' autoComplete="off" />
              </div>

              {/* <div className="new-todo-row">
              <label htmlFor="entry-description">Start: </label>
              <input type="date" id="new-todo-start" name="new-todo-start"  />
              </div>

              <div className="new-todo-row">
              <label htmlFor="entry-description">Deadline: </label>
              <input type="date" id="new-todo-deadline" name="new-todo-deadline"  />
              </div> */}
          
            <div className="new-todo-row">     
              <label htmlFor="Low">Priority: </label>
              <input type="radio" name="Priority" id="Low" value="Low"/>
              <label htmlFor="Low">Low</label>

              <input type="radio" name="Priority" id="Medium"  value="Medium" checked/>
              <label htmlFor="Medium">Medium</label>

              <input type="radio" name="Priority" id="High" value ="High" />
              <label htmlFor="High">High</label>
            </div>

            <span className='btn submit-button' type="submit" onClick={this.addHandle}>Add</span>
      </div>
    )}
}

}

class IndividualTodoList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      // todoList: this.props.todoList
      todoList: todoList
    };

    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.refresh = this.refresh.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  addItem() {
    let newTitle = document.getElementById("entry").value
    if (newTitle == "") return alert("Please enter a title")
    if (newTitle.length > 36) return alert("Title must not exceed 36 characters")
    let newDescription = document.getElementById("entry-description").value
    let newPriority = document.querySelector('input[name=Priority]:checked').value
    new Todo(newTitle, newDescription, newPriority, this.props.todoList)
    document.getElementById("entry").value = ""
    this.refresh()
  }

  toggleDisplay() {
    displayAll = displayAll ? false : true 
    this.refresh()
  }

  refresh() {
    this.setState({todoList: this.props.todoList});
  }

  render() {
  return (
    <div className="todo-list-individual">

      <button className="displayAll" id="displayAll" onClick={this.toggleDisplay}>{displayAll? "Show Unfinished" : "Show All"} </button>

      <div className="todo-column">
        <div className="todoTable" id="todoTable">

          {todoList.map((e)=>{
              if (displayAll == false && e.done) return
              if (e.deleted) return
              var anyTodos = true;
              return (
              <TodoCard todo={e} refresh={this.refresh} /> 
              );
            }
          )}
        </div>
        <NewTodo addItem={this.addItem}  />
        </div>

    </div>
  );
}
}

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      listsoflists: list_of_todo_lists,
      todoList: todoList,
      todoList2: todoList2
    };

    };


  render() {
  return (
    <div className="App">
      <header>

        <div className="title" id="title"><h1>React To Do List</h1></div>
        <div className="description" id="description">Add stuff to todo list and check off completed items</div>
        {/* <button onClick={()=>{console.log(todoList)}}>todoList wat</button> */}
      </header>

      <div className="main-area">

      <IndividualTodoList todoList={this.todoList} />
      {/* <IndividualTodoList todoList={this.todoList2} /> */}
      
      </div>

    </div>
  );
}
}

export default App;
