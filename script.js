
const body = document.querySelector('body')
const themeSwitch = document.querySelector('.theme-switch')
const themeSwitchCheck = document.getElementById('theme-switch')

const todos = document.querySelector('.todo')
const todoInput = document.getElementById('new-todo')
const added = document.getElementById('added')

const itemsLeft = document.querySelector('.items-left > span')
const showing = document.querySelectorAll('.showing > p')
const allTodo = document.querySelector('.allTodo')
const activeTodo = document.querySelector('.activeTodo')
const completedTodo = document.querySelector('.completedTodo')
const clear = document.querySelector('.clear')



const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status ==200) {
        const myData = JSON.parse(this.responseText)

        dataUse(myData)
    }
}
xhttp.open("GET", "data.json", true);
xhttp.send();



themeSwitch.addEventListener('click', ()=>{
    if(themeSwitchCheck.checked == true){
        body.setAttribute('data-theme', 'light')
    }else{
        body.setAttribute('data-theme', 'dark')
    }
})

// Create html elements
createElements = (name, todo) =>{
    const div = document.createElement('div')
    div.setAttribute('class', 'draggable')
    div.setAttribute('draggable', 'true')
    todos.appendChild(div)
    
    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.setAttribute('id', name)
    input.setAttribute('class', 'checks')
    div.appendChild(input)
    
    const label = document.createElement('label')
    label.setAttribute('for', name)
    label.setAttribute('class', `${name} tasks`)
    div.appendChild(label)
    
    const span = document.createElement('span')
    label.appendChild(span)
    
    const paragraph = document.createElement('p')
    paragraph.innerHTML = todo
    label.appendChild(paragraph)
    
    const cross = document.createElement('img')
    cross.setAttribute('class', 'cross')
    cross.setAttribute('src', 'images/icon-cross.svg')
    label.appendChild(cross)
    
    const crosses = document.querySelectorAll('.cross')
    crosses.forEach((cross)=>{
        cross.addEventListener('click', ()=>{
            cross.classList.add('delete')
            del()
        })
    })
}


// Show data
dataUse = (data) =>{
    data.forEach((datas)=>{
        const todoName = datas.name
        const todo = datas.todo
        createElements(todoName, todo)
    })
    
    const draggables = document.querySelectorAll('.draggable')
        
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })
            
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })
        
    todos.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(todos, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            todos.appendChild(draggable)
        } else {
            todos.insertBefore(draggable, afterElement)
        }
    })
        
    function getDragAfterElement(todos, y) {
        const draggableElements = [...todos.querySelectorAll('.draggable:not(.dragging)')]
            
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
    
    remaining()
}


// Remaining counter
remaining = () =>{
    const checks = document.querySelectorAll('.checks')
    
    // Counts remaining
    count = 0;
    for (var i=0; i<checks.length; i++) {
        if (checks[i].classList.contains('hide') == false && checks[i].checked === false){
            count++;
        }
        itemsLeft.innerHTML = count
    }
    
    // Event to change remaining
    checks.forEach((check)=>{
        check.addEventListener('change', ()=>{
            remaining()
        })
    })
}


// 'Todo adder
todoInput.addEventListener('focusout', ()=>{
    if (todoInput.value !== ''){
        // Animation for added todo
        added.checked = true
        setTimeout(function(){
            added.checked = false
        }, 400)
        
        // Create new todo
        const tasks = document.querySelectorAll('.todo > div')
        const newTodoName = `task${tasks.length + 1}`
        const newTodo = todoInput.value
        createElements(newTodoName, newTodo)
        
        // Changes remaining
        remaining()
        
        todoInput.value = ''
    }
})


// Showing
allTodo.addEventListener('click', ()=>{
    // Change current selected option
    showing.forEach((shown)=>{
        shown.classList.remove('focused')
    })
    allTodo.classList.add('focused')
    
    // Show everything
    const tasks = document.querySelectorAll('.todo > div')
    
    tasks.forEach((task)=>{
        task.classList.remove('hide')
    })
    
    remaining()
})

activeTodo.addEventListener('click', ()=>{
    // Change current selected option
    showing.forEach((shown)=>{
        shown.classList.remove('focused')
    })
    activeTodo.classList.add('focused')
    
    // Show only active
    const tasks = document.querySelectorAll('.todo > div')
    
    tasks.forEach((task)=>{
        const taskInput = task.children[0]
        if(taskInput.checked == true){
            task.classList.add('hide')
        }else{
            task.classList.remove('hide')
        }
    })
    
    remaining()
})

completedTodo.addEventListener('click', ()=>{
    // Change current selected option
    showing.forEach((shown)=>{
        shown.classList.remove('focused')
    })
    completedTodo.classList.add('focused')
    
    // Show only completed
    const tasks = document.querySelectorAll('.todo > div')
    
    tasks.forEach((task)=>{
        const taskInput = task.children[0]
        if(taskInput.checked == true){
            task.classList.remove('hide')
        }else{
            task.classList.add('hide')
        }
    })
    
    remaining()
})


// Clear completed
clear.addEventListener('click', ()=>{
    const tasks = document.querySelectorAll('.todo > div')

    tasks.forEach((task)=>{
        const taskInput = task.children[0]
        if(taskInput.checked == true){
            task.classList.add('delete')
        }
    })
    
    const toBeDeleted = document.querySelectorAll('.delete')
    
    toBeDeleted.forEach((deleteThis)=>{
        deleteThis.remove()
    })
})


// Delete
del = () =>{
    const tasks = document.querySelectorAll('.todo > div')

    tasks.forEach((task)=>{
        const cross = task.children[1].children[2]
        
        if(cross.classList.contains('delete') == true){
            task.remove()
        }
    })
}
