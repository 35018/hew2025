"use client"
import { useState } from "react";
import Calender from "../../components/Calender/calender";
import Sidebar from "../../components/sidebar";

import Events from "../events/events";
import Objects from "../objects/objects";
import Config from "../../util/config";


export default function Home(){
    const [status,setStatus] = useState<string>('monthly');
    const [userName,setUserName] = useState<string>("");

    return(

    <div className="h-full w-dvw flex flex-col-reverse md:flex-row items-start justify-start md:gap-10 static">
        <title>とらべりん</title>
        <section id="menu" className=" w-full md:w-[300px] h-1/5 md:h-dvh overflow-auto">
            <Sidebar 
                status={status}
                setState={setStatus}
                userName ={userName}
                setUserName={setUserName}
            />
        </section>

    <section id="main" className="w-3/4 md:w-dwh h-4/5 md:h-dvh  overflow-auto mx-auto">
        {status=='monthly' && 
            <Calender/>
        }
        {status=='searchObj' && <Objects/>}

        {status=='eventlist' && <Events/>}
        {status=='config' &&<Config setUserName={setUserName}/>}
    </section>

    </div>

    )


}