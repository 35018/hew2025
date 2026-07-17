// 過去のイベントのリスト
import axios from "axios"
import { useState,useEffect } from "react"

type Event ={
        id:number,
        title:string,
        date:string,
        start:string,
        end:string,
        category:string[],
        address:string,
        parent:number
    }

type LogProps ={
    setMode:React.Dispatch<React.SetStateAction<string>>
    setLogId:React.Dispatch<React.SetStateAction<number>>
    id:string
}


export default function LogList({setMode,setLogId,id}:LogProps){
    // ログリスト
    const [logList,setLogList] = useState([])
    const [load,setLoad] = useState(false)

    // リスト読み込み
    useEffect(()=>{
        axios.get('http://localhost:8080/api/events/old/'+id)
        .then((response)=>{
            console.log(response.data);
            setLogList(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
    },[])

    // ページネーション表示
    const [startObj,setStartObj] = useState(0)
    const [per,setPer] = useState(5)
    const [endObj,setEndObj]= useState(per) 



    // ページネーション
    function pageNext(){
        if(startObj+per<= logList.length){
        setStartObj(startObj+per)
        setEndObj(endObj+per)
        }
        if(endObj+per >= logList.length){
            setEndObj(logList.length)
        }
    }
    function pagePrev(){
        if(startObj-per<0){
            setStartObj(0)
            setEndObj(per)
        }else{
            setStartObj(startObj-per)
            if(endObj-per<=per){
                setEndObj(per)
            }else{             
                setEndObj(endObj-per)
            }
        }

    }


    return(
        <div id="list_wrap">
            {load == true ?(
                <div id="eventList" className="">
                    {Array.isArray(logList) &&logList.slice(startObj,startObj+per).map((event:Event)=>(

                        <div key={event.id} className="flex flex-row items-center p-2 border-2 mb-2 border-teal-700 hover:bg-teal-700 hover:text-white" onClick={()=>setLogId(event.id)}>
                            <p className="w-50 py-2 mr-1 align-middle truncate">{event.title}</p>
                            <div>
                                <p className="w-50">{event.start.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')}</p>
                                <p className="w-50">{event.end.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')}</p>
                            </div>
                            <div className="w-50">
                            {event.category.map((item,index)=>(
                                <p className=" font-bold" key={index}>{item}</p>
                            ))}
                            </div>
                            <p className="w-50">{event.address}</p></div>
                    ))}
                    <div id="page" className="">
                    <p>全{logList.length}件</p>
                    {logList.length > per &&
                        <div id="page_btn"className="flex flex-row justify-center items-center font-bold gap-2">
                            <button onClick={pagePrev} className="arrow hover:bg-teal-900 hover:text-white hover:underline">＜</button>
                            <p>{startObj+1}-{endObj}</p>
                            <button onClick={pageNext} className="arrow hover:bg-teal-900 hover:text-white hover:underline">＞</button>
                        </div>
                    }

                    </div>
            </div>
            ):(
                <div id="load_list" className="flex items-center justify-center">
                    <p className="text-gray-500 text-2xl">読み込み中・・・</p>
                </div>
            )}

        </div>

    )
}