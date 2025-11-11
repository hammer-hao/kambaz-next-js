import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import {ListGroup, ListGroupItem} from "react-bootstrap";
export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button className="btn btn-success me-2" onClick={addElement}>Add Element</button>
      <ListGroup className="mt-3">
        {array.map((item, index) => (
          <ListGroupItem
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{item}</span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteElement(index)}
            >
              Delete
            </button>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr/>
      <ListGroup>
        {todos.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (todo: any) => (
          <ListGroupItem key={todo.id}>
            {todo.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>);}