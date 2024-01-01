'use client'
import styles from '../page.module.css'
import React,{Dispatch, SetStateAction,useEffect,useState} from 'react'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import workhours from '../images/workhours.png'

type typeofTaskProps={
  status:number,
  taskUpdated:boolean,
  SetTask:Dispatch<SetStateAction<string>>,
  SetId:Dispatch<SetStateAction<string>>,
  SetStatus:Dispatch<SetStateAction<number>>,
  SetHours:Dispatch<SetStateAction<number>>,
  SetTaskCompleted:Dispatch<SetStateAction<number>>
}
type Props={
  obj:typeofTaskProps
}
function Task(props:Props) {
    type list={
        _id:string
        task:string,
        status:number,
        priority:number,
        completeratio:number,
        workHours:number
      }
      const [list, setlist] = useState<Array<list>>([])
    useEffect(() => {
        GetTasksAsPerStatus().then((result:any)=>{
          if(result.error){
            setlist([])
          }
          else{
            setlist(result)
          }
        })
    }, [props.obj.status,props.obj.taskUpdated])
    const GetTasksAsPerStatus=async()=>{
        const data=await fetch("../api/list",{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: props.obj.status }),
          })
          const jsondata=await data.json();
          return jsondata;
    }
    const OpenEditor=(taskid:string,taskdescription:string,status:number,priority:number,completeRatio:number,workHours:number)=>{
      const prioritybtn=document.getElementsByName("prioritybtn") as NodeListOf<HTMLInputElement>
      prioritybtn.forEach((item)=>{
        if(Number(item.value)==priority)
        item.checked=true;
      })
      if(status==1){
      var progressBar = document.getElementById("myProgressBar") as HTMLDivElement;
      progressBar.style.width = completeRatio+'%';
      progressBar.innerHTML = Math.round(completeRatio) + "% completed";
      const progressbar=document.getElementById("progress-outer") as HTMLDivElement
      progressbar.classList.add('d-block')
      progressbar.classList.remove('d-none')
      props.obj.SetTaskCompleted(completeRatio)
      }
      else{
        const progressbar=document.getElementById("progress-outer") as HTMLDivElement
      progressbar.classList.remove('d-block')
      progressbar.classList.add('d-none')
      }
            props.obj.SetId(taskid);
            props.obj.SetTask(taskdescription);
            props.obj.SetStatus(status)
            props.obj.SetHours(workHours)
            const statuseditor=document.getElementById("task-status")!;
            statuseditor.classList.remove("d-none");
            statuseditor.classList.add("d-block")
            const editor=document.getElementById("btn-addedit")!;
            editor.innerHTML="Edit";
    }
    const closeTask=async(id:string)=>{
      const response=await fetch("../api/list",{
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:id})
      });
      const res=await response.json();
      if(res.status==1){
        document.getElementById(id)?.remove();
        toast.success('Task removed successfuly!', {
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
  return (
    <>
    <ul className="list-group w-100">
    {list.map((k:list)=>{
        return <li key={k._id} id={k._id} className="list-group-item mt-2">
          <div className="d-flex justify-content-between align-items-center">
        {k.task}
        <div className='d-flex justify-content-between align-items-center'>
          <span>Priority :</span> <div className={`${styles.taskPriority} ms-2`} style={{backgroundColor:k.priority==1?'red':k.priority==2?'rgb(255, 187, 0)':'green'}}></div>
        </div>
        <div>
        <button type="button" className="btn btn-primary" onClick={()=>{OpenEditor(k._id,k.task,k.status,k.priority,k.completeratio,k.workHours)}}>Edit</button>
        {k.status==2?<button className="btn btn-primary ms-2" onClick={()=>{closeTask(k._id)}} type='button'>Close</button>:""}
        </div>
        </div>
        {k.status!=0?
        <div className='w-100 d-flex justify-content-between'>
        <div className="progress mt-2 w-50">
  <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" id='completeRatio' role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{"width":k.completeratio+'%'}}>{k.completeratio}% completed </div>
</div>
<div className='w-50 d-flex justify-content-end align-items-center'><img src={workhours.src} className={styles.workhours}></img><span className='ms-2'>Work-hours : {Math.round((k.completeratio*k.workHours)/100)}/{k.workHours}</span></div>
</div>:<div className='w-100 d-flex justify-content-between'><div className='w-100 d-flex justify-content-end align-items-center'><img src={workhours.src} className={styles.workhours}></img><span className='ms-2'>Work-hours : {k.workHours}</span></div></div>}
      </li>
    })}
    </ul>
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

export default Task