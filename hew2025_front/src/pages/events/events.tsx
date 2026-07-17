import { useState } from "react";
import Event_list from "./event_list";
import Event_detail from "./event_detail";

export default function Events(){
    const [detail,setDetail] = useState<number>(0)




    return(
        <div id="events_wrapper">
            {detail === 0 ?(
                <Event_list setDetail={setDetail}/>
            ):(
                <Event_detail id={detail} setId={setDetail}/>
            )}
        </div>
    )
}