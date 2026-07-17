import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import InteractionPlugin from "@fullcalendar/interaction";
import { useEffect,useState } from "react";
import axios from "axios";
import Modal from 'react-modal';

import Timeline from "../Timeline/timeline";
import CalenderEvent from "./calender_event";



// カレンダー機能の親コンポーネント
// 子コンポーネントにFullcalender用に加工したデータを渡す


export default function Calender(){

    const [tldate,setTldate] = useState(null);
    const [event,setEvent] = useState([]);
    const [modal,setModal] = useState(false);
    const [eventid,setEventId] = useState(0);
    const [user_id,setUserid] = useState("");
    useEffect(()=>{
            // クッキー取得
            const cookie_list = document.cookie.split(';')
            cookie_list.forEach(cookie=>{
                const keyval = cookie.split("=")
                if(keyval[0].trim()=="user"){
                    setUserid(keyval[1])
                axios.get(`http://localhost:8080/api/events/user/${keyval[1]}`)
                .then((response)=>{
                    console.log(response.data);
                    setEvent(response.data);

            }).catch((error)=>{
                console.log(error);
            },)
                }
            })
            

        
    },[]);

    


    function handledateClick(e){
        console.log(e.dateStr);
        setTldate(e.dateStr);
        
    }
    function handleEventClick(e){
        console.log(e.event.id);
        setEventId(e.event.id);
        setModal(true);

    }
    function closeModal(){
        setModal(false);
    }

    function reload(){
        axios.get(`http://localhost:8080/api/events/user/${user_id}`)
                .then((response)=>{
                    console.log(response.data);
                    setEvent(response.data);

            }).catch((error)=>{
                console.log(error);
            },)
        

    }

    return(
        <div className="z-0 w-full md:w-5/6 mt-5">
            <button type="button" className=" relative flex justify-start text-white bg-teal-800 hover:bg-teal-400 text-xs" onClick={reload}>再読み込み</button>
            {tldate == null && 
            <FullCalendar
            plugins={[dayGridPlugin,InteractionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            dateClick={handledateClick}
            eventClick={handleEventClick}
            
            allDayClassNames={"z-0 h-1/6"}
            eventClassNames={"z-1"}
            viewClassNames={" h-full md:h-[550px]"}
            
            
            height={500}
            
            
            events={event}
            locale={'jp'}
            />
            }

            {tldate != null &&
            <div>
                <Timeline date={tldate} events={event} eventClick={handleEventClick}/>
                <button className="bg-teal-950 text-white left-0 mt-5" onClick={()=>{setTldate(null)}}>戻る</button>

            </div>
            }

            <Modal
                isOpen={modal}
                onRequestClose={closeModal}
                style={{
                    overlay:{
                        position: 'fixed',
                        top:0,
                        left:0,
                        right:0,
                        bottom:0,
                        zIndex:2000
                    }  
                }}
            >
                <CalenderEvent event_id={eventid} modal={setModal}/>
            </Modal>
        </div>
    );
}

