import { useState,useEffect } from "react";
import axios from "axios";

import linkIcon from '../../components/icon/open_link.svg'
import mapIcon from '../../components/icon/open_map.svg'

import Geocode from "../Map/geocode";

type Props ={
    event_id:number,
    modal:React.Dispatch<React.SetStateAction<boolean>>
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
    child:number,

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

export default function CalenderEvent({event_id,modal}:Props){

    // 子イベント切り替え関係
    // 子イベント表示用
    const [child,setChild] = useState([]);
    // 表示するイベントを保持
    const [now,setNow] = useState(event_id);
    // 親イベントを保持
    const [parent,setParent] = useState(0);

    const [event,setEvent] = useState<EventProps>({
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
    const [load,setLoad] = useState(false)
    // url
    const outsideWindow =(url:string)=>{
        window.open(url)
    }
    // イベント取得
    useEffect(()=>{
        axios.get('http://localhost:8080/api/events/'+event_id)
        .then((response)=>{
            console.log(response.data);
            setEvent(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
    },[])
    // 子イベント取得
    useEffect(()=>{
        console.log(event.child)
        if(event.child != 0){
        axios.get('http://localhost:8080/api/events/child/'+event_id)
        .then((response)=>{
            setChild(response.data)
            console.log(child)
        }).catch((error)=>{
            console.log(error)
        })

        }

    },[event])

    // 子イベントを表示
    function changeChild(childId:number){
        setParent(event_id);
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


    // 親イベントを表示
    function returnParent(){
    setParent(0);
    setChild([]);
    setNow(event_id);
    setLoad(false);
    }

    return(
        <div id="eventWrap" className="m-5 max-h-[550px] min-h-[200px]: h-4/5 md:h-dvh">
            <button type="button" className="border-2 border-teal-700 hover:bg-teal-700 hover:text-white"  onClick={()=>modal(false)}>とじる</button>
            
            {parent!= 0 &&
                <button onClick={()=>returnParent()}>親イベントに戻る</button>
            }
            {load==true?(
                <div id="event_detail" className="flex flex-col items-center justify-center gap-2.5">
                    <p className="text-2xl mb-2 mx-5 w-4/5 text-wrap text-center font-bold">{event.title}</p>
                    <h3>カテゴリ</h3>
                    <div id="categories" className="flex flex-row justify-center gap-2">
                    {event.category.map((catName,catKey)=>(
                        <p key={catKey} className="p-2.5 border border-teal-800 rounded-xl mb-5">{catName}</p>
                    ))}
                    </div>
                    <h3 className="font-bold">日時</h3>
                    <p>{event.open_date.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} {event.start_time} ~ {event.close_date.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} {event.end_time}</p>
                    <h3 className="font-bold">場所</h3>
                    <p>{event.place}:{event.address}</p>
                    {event.address != null && <Geocode locate={event.address}/>}
                    {event.place!=null &&
                        <button type="button"  className="p-2 text-white bg-teal-800 hover:bg-teal-800/70"  onClick={()=>outsideWindow('https://www.google.com/maps/search/?api=1&query='+event.place)}>
                                <img src={mapIcon} alt="マップ" className="w-5 h-5 text-white" />
                        </button>
                    }
                    <h3 className="font-bold">説明</h3>
                    <p className="whitespace-pre-wrap">{event.ex}</p>
                    <h3 className="font-bold">リンク</h3>
                    {event.url.map((link:UrlProp)=>(
                        
                        <div key={link.id} >
                            {link.url !="" &&
                            <div className="mb-2.5 flex flex-row justify-center items-center gap-2.5" >
                                <p className="font-bold">{link.title}</p>
                                <button type="button" className="p-2 text-white bg-teal-800 hover:bg-teal-800/70" onClick={()=>outsideWindow(link.url)}>
                                    <img src={linkIcon} alt="リンク" className="w-5 h-5 text-white" />
                                </button>
                            </div>
                            }
                            </div>
                    ))}

                    {parent==0 && child.length != 0 &&
                    <h3>子イベント</h3>
                    }
                    {parent== 0 && child.map((c:ChildProp)=>(
                        <div key={c.id} className="flex items-center justify-center ">
                            <p className="text-teal-400 text-lg">●</p>
                            <button onClick={()=>changeChild(c.id)}><p  className="hover:border-b-2">{c.title}</p></button>
                            </div>
                    ))}

                </div>
            ):(
                <div>読み込み中・・・</div>
            )}
        </div>
    )

}