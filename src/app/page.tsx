'use client'

import styles from './page.module.css'
import { Dispatch, SetStateAction, useState } from 'react'
import Task from './components/task'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  type typeofTaskProps={
    status:number,
    taskUpdated:boolean,
    SetTask:Dispatch<SetStateAction<string>>,
    SetId:Dispatch<SetStateAction<string>>,
    SetStatus:Dispatch<SetStateAction<number>>,
    SetHours:Dispatch<SetStateAction<number>>
    SetTaskCompleted:Dispatch<SetStateAction<number>>
  }
  const [task, settask] = useState<string>("")
  const [status, setstatus] = useState<number>(0)
  const [hours, sethours] = useState<number>(0)
  const [id, setid] = useState<string>("")
  const [taskTab, settaskTab] = useState<number>(0)
  const [taskupdated,settaskupdated] = useState<boolean>(false);
  const [taskcompleted,settaskcompleted]= useState<number>(0);
  const TaskProps:typeofTaskProps={
    status:taskTab,
    SetStatus:setstatus,
    SetId:setid,
    SetTask:settask,
    SetHours:sethours,
    taskUpdated:taskupdated,
    SetTaskCompleted:settaskcompleted
  }
 const AddTask=async ()=>{
  if(String(task).trim().length>10){
    const editor=document.getElementById("btn-addedit")
    const priority=document.querySelector('input[name="prioritybtn"]:checked')?.attributes.getNamedItem("value")?.value;
    if(editor?.innerText=="Add"){
    const response=await fetch("../api/list/add",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({task:task,priority:priority==undefined?3:Number(priority),workHours:hours})
    });
    const res=await response.json();
    if(res.status==1){
      settask("");
      sethours(0);
      const prioritybtn=document.getElementsByName("prioritybtn") as NodeListOf<HTMLInputElement>
      prioritybtn.forEach((item)=>{
        item.checked=false;
      })
      toast.success('Task added successfuly!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  }
  else{
    EditTasks();
  }
}
 }

 const changeTasks=(type:number)=>{
    settaskTab(type);
    const tasksDivs=document.getElementById("all-tasks")?.children
    for (let index = 0; index < 3; index++) {
      const element = tasksDivs?.item(index);
      if(index!=type)
      {
      if(element?.classList.contains("shadow")){
        element.classList.remove("shadow")
        element.classList.remove("rounded")
      }
    }
    else{
      if(!element?.classList.contains("shadow")){
        element?.classList.add("shadow")
        element?.classList.add("rounded")
      }
    }
    }
 }

 const EditTasks=async()=>{
  const priority=document.querySelector('input[name="prioritybtn"]:checked')?.attributes.getNamedItem("value")?.value;
  const response=await fetch("../api/list",{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({task:task,id:id,status:status,priority:priority==undefined?3:Number(priority),completeratio:taskcompleted,workHours:hours})
  });
  const res=await response.json();
  if(res.status==1){
    settask("");
    if(taskupdated){
    settaskupdated(false);
    }
    else{
      settaskupdated(true)
    }
    const prioritybtn=document.getElementsByName("prioritybtn") as NodeListOf<HTMLInputElement>
      prioritybtn.forEach((item)=>{
        item.checked=false;
      })
    toast.success('Task Edited successfuly!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
            const statuseditor=document.getElementById("task-status")!;
            sethours(0);
            statuseditor.classList.remove("d-block");
            statuseditor.classList.add("d-none")
            const editor=document.getElementById("btn-addedit")!;
            editor.innerHTML="Add";
            const progressbar=document.getElementById("progress-outer") as HTMLDivElement
            progressbar.classList.remove('d-block')
            progressbar.classList.add('d-none')
  }
 }
 function updateProgress(event:any) {
  var progressBar = document.getElementById("myProgressBar") as HTMLDivElement;
  var outer=document.getElementById("progress-outer") as HTMLDivElement;
  var clickX = event.clientX - progressBar.getBoundingClientRect().left;
  var progressBarWidth = outer.clientWidth;
  var percentage = (clickX / progressBarWidth) * 100;
  progressBar.style.width = clickX+'px';
  progressBar.innerHTML = Math.round(percentage)>99?'100% completed':Math.round(percentage) + "% completed";
  settaskcompleted(Math.round(percentage))
}
  return (
    <>
      <div className='w-100 d-flex justify-content-center mb-2 mt-5 flex-column align-items-center'>
        <div className='w-25 d-flex justify-content-center flex-column align-items-center'>
          <textarea className="form-control" id="task" value={task} rows={2} onChange={(e) => { settask(e.target.value) }}></textarea>
          <div className='d-flex align-items-center'>
            <label className='w-50'>Work Hours: </label>
          <input type="number" className="form-control mt-2 w-75" placeholder="Work Hours" value={hours} min={0} onChange={(e) => { sethours(Number(e.target.value)) }}></input>
          </div>
          <div className={`progress mt-2 w-100 d-none`} id='progress-outer' onClick={(event)=>{updateProgress(event)}}><div className={`progress-bar progress-bar-striped progress-bar-animated bg-success`} id='myProgressBar' role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}></div></div>
          <select className="form-select mt-2 d-none" id='task-status' value={status} onChange={(e)=>{setstatus(Number(e.target.value))}} aria-label="Default select example">
            <option value={0}>ToDo</option>
            <option value={1}>Active</option>
            <option value={2}>Completed</option>
          </select>
          <div className='d-flex mt-3' id='priorityValues'>
            <div className="form-check form-check-inline">
              <input className={`${styles.high} form-check-input `} type="radio" name="prioritybtn" id="high" value={1} />
              <label className="form-check-label" htmlFor="high">High</label>
            </div>
            <div className="form-check form-check-inline">
              <input className={`${styles.medium} form-check-input `} type="radio" name="prioritybtn" id="medium" value={2} />
              <label className="form-check-label" htmlFor="medium">Medium</label>
            </div>
            <div className="form-check form-check-inline">
              <input className={`${styles.low} form-check-input `} type="radio" name="prioritybtn" id="low" value={3} />
              <label className="form-check-label" htmlFor="low">Low</label>
            </div>
          </div>
          <button type="button" id='btn-addedit' className="btn btn-primary mb-2 mt-3" onClick={AddTask}>Add</button>
        </div>
      </div>
      <div className='d-flex w-100 justify-content-center mt-3 ' id='all-tasks'>
        <div className={`shadow rounded p-3 mb-5`} style={{cursor:'pointer'}} onClick={()=>{changeTasks(0)}}>To-do</div>
        <div className='ms-5 p-3 mb-5' style={{cursor:'pointer'}} onClick={()=>{changeTasks(1)}}>Active</div>
        <div className='ms-5 p-3 mb-5' style={{cursor:'pointer'}} onClick={()=>{changeTasks(2)}}>Completed</div>
      </div>
      <div className='w-100 d-flex justify-content-center align-items-center'>
      <div className='d-flex w-50 justify-content-center flex-column'>
        <Task obj={TaskProps}/>
      </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
        </>
  )
}
