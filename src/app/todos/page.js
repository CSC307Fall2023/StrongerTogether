'use client'

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function ToDos() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    function inputChangeHandler(e) {
        setNewTodo(e.target.value);
    }

    function addNewTodo() {
        if (newTodo && newTodo.length) {
            fetch("api/todos", { method: "post", body: JSON.stringify({ value: newTodo, done: false }) })
                .then((response) => {
                    return response.json().then((newTodo) => {
                        setTodos([...todos, newTodo]);
                        setNewTodo('');
                    });
                });
        }
    }
  
    function removeTodo({ id }) {
    fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                // Update the front-end state to remove the item
                setTodos(todos.filter((todo) => todo.id !== id));
            } else {
                throw new Error('Failed to delete ToDo item');
            }
        })
        .catch((error) => {
            console.error('Error while deleting ToDo item:', error);
        });
}

    function toggleDone({ id, done }) {
        fetch(`/api/todos/${id}`, {
            method: 'PUT', 
            body: JSON.stringify({ done: !done }), 
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setTodos((prevTodos) => prevTodos.map((todo) => {
                        if (todo.id === id) {
                            return { ...todo, done: !done };
                        }
                        return todo;
                    }));
                } else {
                    throw new Error('Failed to toggle ToDo item');
                }
            })
            .catch((error) => {
                console.error('Error while toggling ToDo item:', error);
            });
    }

    function checkBox({ index }){
        const todoUpdate = todos[index];
        fetch(`/api/todos/${todoUpdate.id}`, { method: "put", body: JSON.stringify({value: todoUpdate.value, done: !todoUpdate.done}) } ).then((response) => {
            if (response.ok){
                setTodos(todos.map((x) => {
                    return x.id === todoUpdate.id ? {...todoUpdate , done: !todoUpdate.done}: x}))
            }
        });
    }

    

    useEffect(() => {
        fetch("/api/todos", { method: "get" })
            .then((response) => response.ok && response.json())
            .then(
                (todos) => {
                    todos && setTodos(todos);
                    setIsLoading(false);
                }
            );
    }, []);

    const loadingItems = <CircularProgress />;

    const toDoItems = isLoading ? loadingItems : todos.map((todo) => {
        return (
            <ListItem key={todo.id}>
                <ListItemButton>
                    <ListItemIcon>
                        <Checkbox
                            checked={todo.done}
                            disableRipple
                            onChange={() => toggleDone({ id: todo.id, done: todo.done })}
                        />
                    </ListItemIcon>
                    <ListItemText primary={todo.value} />
                    <IconButton onClick={() => removeTodo({ id: todo.id })}>
                        <DeleteForever />
                    </IconButton>
                </ListItemButton>
            </ListItem>
        );
    });

    return (
        <>
            <h2>My ToDos</h2>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                {toDoItems}
                {!isLoading && (
                    <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewTodo}><AddBox /></IconButton>}>
                        <TextField label="New ToDo Item" fullWidth variant="outlined" value={newTodo} onChange={inputChangeHandler} />
                    </ListItem>
                )}
            </List>
        </>
    );
}
