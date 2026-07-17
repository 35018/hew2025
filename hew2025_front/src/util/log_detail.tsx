// 過去のイベントの詳細
import axios from "axios";
import { useState,useEffect } from "react";

// アイコン
import linkIcon from '../components/icon/open_link.svg'
import mapIcon from '../components/icon/open_map.svg'

import Geocode from "../components/Map/geocode";


type DetailProps = {
    id:number,
    setId:React.Dispatch<React.SetStateAction<number>>
}

type EventProps = {
    event_id:number,
    create_user:number,
    parent_event:number|null
    title:string,
    open_date:string,
    close_date:string,
    start_time:string,
    end_time:string,
    place:string,
    address:string,
    ex:string,
    category:string[],
    url:UrlProp[],
    child:number

}

type UrlProp ={
    id:string,
    title:string,
    url:string
}
type ChildProp = {
    id:number,
    title:string,
    start:string,
    end:string,
    category:string[],
    address:string,
}



type logProps = {
    // setMode:React.Dispatch<React.SetStateAction<string>>,
    setLogId:React.Dispatch<React.SetStateAction<number>>,
    id:string,
    logId:number
}



export default function LogDetail({logId,setLogId,id}:logProps){
    const [load,setLoad] = useState(false)

    const [event,setEvent]= useState<EventProps>({
        event_id:0,
        create_user:0,
        parent_event:null,
        title:"",
        open_date:"",
        close_date:"",
        start_time:"",
        end_time:"",
        place:"",
        address:"",
        ex:"",
        category:[],
        url:[],
        child:0
    })
    
    // 子イベント
    const [child,setChild] = useState([])

    // 表示切替
    const [now,setNow] = useState(logId);
    const [parent,setParent] = useState(0);
    // url
    const outsideWindow =(url:string)=>{
        window.open(url)
    }

    // ロード
    
    function id_load(){
        axios.get('http://localhost:8080/api/events/'+logId)
        .then((response)=>{
            console.log(response.data);
            setEvent(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
        
    }
    // 使用データ
    useEffect(()=>{
        id_load()
    },[logId])
    useEffect(()=>{
        console.log(event.child)
        if(event.child != 0){
        axios.get('http://localhost:8080/api/events/child/'+logId)
        .then((response)=>{
            setChild(response.data)
            console.log(child)
        }).catch((error)=>{
            console.log(error)
        })

        }

    },[event])

    
    // 子イベントに切り替え
    function changeChild(childId:number){
        setParent(logId);
        setChild([]);
        setNow(childId);
        setLoad(false);
    }
    useEffect(()=>{
        axios.get('http://localhost:8080/api/events/'+now)
        .then((response)=>{
            console.log(response.data);
            setEvent(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
    },[now])

    
    // 親イベントに切り替え
    function returnParent(){
        setParent(0);
        setChild([]);
        setNow(logId);
        setLoad(false);
    }

    
    // イベント削除
    const eventDelete = ()=>{
        axios.delete('http://localhost:8080/api/events/'+id)
        .then((response)=>{
            console.log(response.data);
            setLogId(0);
        }).catch((error)=>{
            console.log(error)
        })
    }

    return(
        <div id="event_wrapper" className="m-5 max-h-[550px] min-h-[200px] h-4/5 md:h-dvh mx-auto">
            {load == true?(
                <div id="event_detail" className="flex flex-col justify-center items-center">
                    <p className="text-xl mb-2 mx-5 w-4/5 text-wrap">{event.title}</p>
                    <h3>カテゴリ</h3>
                    <div id="categories" className="flex flex-row justify-center gap-2">
                    {event.category.map((catName,catKey)=>(
                        <p key={catKey} className="p-2.5 border border-teal-800 rounded-xl mb-5">{catName}</p>
                    ))}
                    </div>
                    <h2>{event.create_user}</h2>
                    <h3>日時</h3>
                    <p>{event.open_date.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} {event.start_time} ~ {event.close_date.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} {event.end_time}</p>
                    <h3>場所</h3>
                    <p>{event.place}:{event.address}</p>
                    <div className=" flex flex-row gap-5 justify-center items-center mb-5">
                    {event.address!=null &&
                        <Geocode locate={event.address}/>
                    }
                    {event.place!=null &&
                        <button type="button"  className="p-2 text-white bg-teal-800 hover:bg-teal-800/70"  onClick={()=>outsideWindow('https://www.google.com/maps/search/?api=1&query='+event.place)}>
                            <img src={mapIcon} alt="マップ" className="w-5 h-5 text-white"   />
                        </button>
                    }
                    </div>
                    <h3>説明</h3>
                    <p className="whitespace-pre-wrap">{event.ex}</p>
                    <h3>リンク</h3>
                    {event.url.map((link:UrlProp)=>(
                        <div key={link.id} className="mb-2.5 flex flex-row justify-center items-center gap-2.5" >
                            <p className="font-bold">{link.title}</p>
                            <button type="button" className="p-2 text-white bg-teal-800 hover:bg-teal-800/70" onClick={()=>outsideWindow(link.url)}>
                                <img src={linkIcon} alt="リンク" className="w-5 h-5 text-white" />
                            </button>
                            </div>
                    ))}

                    {parent==0 && child.length != 0 &&
                    <h3>子イベント</h3>
                    }
                    {parent== 0 && child.map((c:ChildProp)=>(
                        <div key={c.id} className="flex items-center justify-center mb-5">
                            <p className="text-teal-400 text-lg">●</p>
                            <button onClick={()=>changeChild(c.id)}><p  className="hover:border-b-2">{c.title}</p></button>
                            </div>
                    ))}
                    {event.parent_event != null &&now == logId &&
                        <div className="mb-5">
                            <h3>親イベント</h3>
                            <div  className="flex items-center justify-center ">
                                <p className="text-teal-400 text-lg">●</p>
                                <button onClick={()=>changeChild(event.parent_event)}>親イベントを確認</button>
                            </div>

                        </div>
                    }
                    {now != logId &&
                        <button onClick={returnParent} className="border-teal-900 bg-white hover:bg-teal-900 text-teal-900 hover:text-white text-[0.75rem] border mb-5">元のイベントに戻る</button>
                    }
                    <div className=" flex gap-5 items-center">
                        <button onClick={()=>setLogId(0)} className=" border-2 border-teal-900">一覧に戻る</button>
                        <button onClick={eventDelete} className="bg-teal-900 text-white">削除</button>

                    </div>
                </div>
            ):(
                <div id="load_detail" className="flex items-center justify-center">
                    <p className="text-gray-500 text-2xl">読み込み中・・・</p>
                </div>
            )}

        </div>
    )
}