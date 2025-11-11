import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroupItem } from "react-bootstrap";

type Todo = {
    id: string
    title: string
    description: string
}

export default function TodoItem({ todo }: {todo: Todo}) {
  const dispatch = useDispatch();

  return (
    <ListGroupItem key={todo.id} className="d-flex justify-content-between align-items-center">
      <span>{todo.title}</span>
      <div>
        <Button
          variant="primary"
          size="sm"
          className="me-2"
          id="wd-set-todo-click"
          onClick={() => dispatch(setTodo(todo))}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          id="wd-delete-todo-click"
          onClick={() => dispatch(deleteTodo(todo.id))}
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
}
