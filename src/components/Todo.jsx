import React, { useState, useRef, useEffect } from "react";
import { Button, Checkbox, List, TextInput } from "flowbite-react";
import { MdDelete } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";

const getLocalItems = () => {
  try {
    let list = localStorage.getItem("lists");
    if (list) {
      return JSON.parse(list);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    localStorage.setItem("lists", JSON.stringify([]));
    return [];
  }
};

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(getLocalItems());
  const [editId, setEditId] = useState(0);

  const inputRef = useRef("null");
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const addTodo = () => {
    if (todo !== "") {
      setTodos([...todos, { list: todo, id: Date.now(), status: false }]);
      setTodo("");
    }
    if (editId) {
      const editTodo = todos.find((todo) => todo.id == editId);
      const updateTodo = todos.map((to) =>
        to.id === editTodo.id
          ? { id: to.id, list: todo, status: to.status }
          : to
      );
      setTodos(updateTodo);
      setEditId(0);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
    localStorage.setItem("lists", JSON.stringify(todos));
  }, [todos]);

  const onDone = (id) => {
    let complete = todos.map((todolist) => {
      if (todolist.id === id) {
        return { ...todolist, status: !todolist.status };
      }
      return todolist;
    });
    setTodos(complete);
  };

  const onEdit = (id) => {
    const editTodo = todos.find((to) => to.id === id);
    setTodo(editTodo.list);
    setEditId(editTodo.id);
  };

  const onDelete = (id) => {
    setTodos(todos.filter((to) => to.id !== id));
  };

  return (
    <div className="min-h-screen mt-50">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-col md:items-center gap-5">
        {/* top */}
        <div className="flex-1">
          <p className="px-2 py-1 rounded-lg font-bold text-4xl">To Do List</p>
        </div>
        {/* bottom */}
        <div className="flex-1 items-center">
          <div className="max-w-width">
            <form className="flex" onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-2 w-full mb-10">
                <TextInput
                  type="text"
                  placeholder="Add new Task to do"
                  className="w-full"
                  value={todo}
                  ref={inputRef}
                  onChange={(e) => setTodo(e.target.value)}
                />
                <Button color="dark" className="w-full" onClick={addTodo}>
                  {editId ? "Update Task" : "Add Task"}
                </Button>
              </div>
            </form>
            <div className="">
              <List
                unstyled
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {todos &&
                  todos.map((to) => (
                    <List.Item
                      key={to.id}
                      className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="min-w-0 flex-1">
                          {to.status ? (
                            <p className="line-through opacity-60 truncate text-sm font-medium text-gray-900 dark:text-white">
                              {to.list}
                            </p>
                          ) : (
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {to.list}
                            </p>
                          )}
                        </div>
                        <div className="inline-flex items-center m-2">
                          {to.status ? (
                            <Checkbox
                              checked
                              id="complete"
                              title="complete"
                              className="m-2"
                              onClick={() => onDone(to.id)}
                            />
                          ) : (
                            <Checkbox
                              id="complete"
                              title="complete"
                              className="m-2"
                              onClick={() => onDone(to.id)}
                            />
                          )}
                          <FiEdit3
                            id="edit"
                            title="eit"
                            className="m-2"
                            onClick={() => onEdit(to.id)}
                          />
                          <MdDelete
                            id="delete"
                            title="delete"
                            className="m-2"
                            onClick={() => onDelete(to.id)}
                          />
                        </div>
                      </div>
                    </List.Item>
                  ))}
              </List>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
