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
import { MarkEmailReadRounded } from '@mui/icons-material';

export default function ToDos() {

    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    function inputChangeHandler(e) {
        setNewTodo(e.target.value);
    }

    function addNewTodo() {
        if(newTodo && newTodo.length) {
            fetch("api/todos", { method: "post", body: JSON.stringify({value: newTodo, done: false}) } ).then((response) => {
                return response.json().then((newTodo) => {
                    setTodos([...todos, newTodo]);
                    setNewTodo('');
                });
            });
        }
    }

    function removeTodo({ index }) {
        const toDoToRemove = todos[index];
        // delete a todo item
        fetch(`api/todos/${toDoToRemove.id}`, {method: "delete"}).then((response) => {
            if (response.ok) {
                setTodos(todos.filter((v,idx) => idx!==index))
            }
            else{
                console.log("Error: Failed to Delete ToDo Item")
            }
        });
    }

    function markToDoAsDone({ index }) {
        // mark a todo item as done and have it saved to the database
        const toDoToMarkAsDone = { ...todos[index], done: !todos[index].done };
        console.log(toDoToMarkAsDone)
        fetch(`api/todos/${todos[index].id}`, { method: "PUT", body: JSON.stringify(toDoToMarkAsDone)})
        .then(
            (response) => {
                if (response.ok) {
                    return response.json().then((newTodo) => {
                        const changedToDo = [...todos];
                        changedToDo[index] = newTodo;
                        setTodos(changedToDo);
                    });
                }
            }
        );
    }

    useEffect(() => {
        fetch("/api/todos", { method: "get" }).then((response) => response.ok && response.json()).then(
            todos => {
                todos && setTodos(todos);
                setIsLoading(false);
            }
        );
    }, []);

    const loadingItems = <CircularProgress/>;

    const toDoItems = isLoading ? loadingItems : todos.map((todo, idx) => {
        return <ListItem key={idx} secondaryAction={
            <IconButton edge="end" onClick={() => removeTodo({index: idx})}><DeleteForever/></IconButton>   
        }>  
            <ListItemButton>
                <ListItemIcon>
                    <Checkbox onClick={() => markToDoAsDone({index: idx})} checked={todo.done} disableRipple/>
                </ListItemIcon>
                <ListItemText primary={todo.value}/>
            </ListItemButton>
        </ListItem>;
    });

    return (
        <>
            <h2>My ToDos</h2>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                { toDoItems }
                {!isLoading && <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewTodo}><AddBox/></IconButton>}>
                    <TextField label="New ToDo Item" fullWidth variant="outlined" value={newTodo} onChange={inputChangeHandler}/> 
                </ListItem>}
            </List>
        </>
    );
}