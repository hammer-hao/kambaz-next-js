import React from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {ListGroup} from "react-bootstrap";
export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            todos.map((todo: any) => (
                // eslint-disable-next-line react/jsx-key
          <TodoItem todo={todo} />
        ))}
      </ListGroup>
      <hr/>
    </div>
  );}
