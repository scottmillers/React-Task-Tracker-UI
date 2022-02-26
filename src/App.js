import {useState, useEffect} from 'react'
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

//const { CREDENTIALS_API_TASKS } = window.config;
const CREDENTIALS_API_TASKS = 'http://localhost:5000/tasks'

function App() {
  
    const [tasks, setTasks] = useState([])
      
  
    const [showAddTask, setShowAddTask] = useState(false)

    useEffect(() => {
      const getTasks = async () => {
          const tasksFromServer = await fetchTasks()
          setTasks(tasksFromServer)
      }
      getTasks()
    }, [])

    const fetchTasks = async () => {
       //const res = await fetch("http://localhost:5000/tasks")
       console.log()
       const res = await fetch(CREDENTIALS_API_TASKS)
       const data = await res.json()
       console.log(data)
       return data
    }

    const fetchTask = async (id) => {
      const res = await fetch(`http://localhost:5000/tasks/${id}`)
      const data = await res.json()
      console.log(data)
      return data
   }
    const addTask = async (task) => {
      // const id = Math.floor(Math.random() * 10000) + 1
      // const newTask = {id, ...task }
      //setTasks([...tasks, newTask])
      //console.log(task)
      const res = await fetch(`http://localhost:5000/tasks`, 
      { 
        method: "POST",
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(task)
      })

      const data = await res.json()

      console.log(data)

      setTasks([...tasks,data])
    }

    const deleteTask = async (id) => {
      // console.log('delete', id)
      
      await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE"})
    
      //filter from the UI
      setTasks(tasks.filter((task) => task.id !== id))
    }

    // Toggle reminder
    const toggleReminder = async(id) => {
      const tasktoToggle = await fetchTask(id)
      const updTask = {...tasktoToggle, reminder: !tasktoToggle.reminder}
      
      const res = await fetch(`http://localhost:5000/tasks/${id}`, 
      {
        method: 'PUT',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(updTask)
      })

      setTasks(
        tasks.map((task) => 
        task.id === id ? {...task, reminder:
        !task.reminder } : task  
      )
      )

    }

  return (
    <BrowserRouter>
    <div className="container">
    
   
    <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
    <Routes>
    <Route path ='/' 
    element = {
       <>
       {showAddTask && <AddTask  onAdd={addTask}   /> }
     {
       tasks.length > 0 ?
       <Tasks tasks={tasks} onDelete={deleteTask}  onToggle={toggleReminder} />
       :
       'No Tasks to Show'
     }
       </>
     } />
      <Route path='/about' element={<About />} />
    </Routes>
    <Footer />
    
    
    </div>
    </BrowserRouter>
     )
  };
  

export default App;
    /*
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
   
      
     <Route path='/' 
     exact 
     render={(props) => (
       <>
       {showAddTask && <AddTask  onAdd={addTask}   /> }
     {
       tasks.length > 0 ?
       <Tasks tasks={tasks} onDelete={deleteTask}  onToggle={toggleReminder} />
       :
       'No Tasks to Show'
     }
       </>
     )} />
     
     
    
    <Footer />
    </div>
    </Routes> }
   
  );
  }
  

export default App;
*/
