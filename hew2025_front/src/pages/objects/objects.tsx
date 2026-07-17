import { useState } from "react";
import Object_detail from "./object_detail";
import Object_list from "./object_list";

export default function Objects(){
    const [detail,setDetail] = useState<number>(0)


    return(
        <div id="wrapper" className="">
            {detail == 0 ?
            (
                <Object_list setDetail={setDetail}/>

            ):(
                <Object_detail id={detail} setDetail={setDetail}/>
            )
                
            }
     
        </div>
    )
}