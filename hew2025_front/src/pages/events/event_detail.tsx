import axios from "axios";
import { useState,useEffect } from "react";
import Modal from 'react-modal';
import EventEdit from "./event_edit";
import CreateChildEvent from "../../components/forms/createChildEvent";

// アイコン
import linkIcon from '../../components/icon/open_link.svg'
import mapIcon from '../../components/icon/open_map.svg'
// map
import Geocode from "../../components/Map/geocode";



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






export default function Event_detail({id,setId}:DetailProps){
    const [load,setLoad]= useState(false)
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
    const [now,setNow] = useState(id);
    const [parent,setParent] = useState(0);
    // modal用
    // childModal
    const [childmodal,setChildModal]= useState(false);
    const openChild =()=>{
        setChildModal(true);
    }
    const closeChild=()=>{
        id_load();
        setChildModal(false);
    }

    // editModal
    const [editModal,setEditModal]= useState(false);
    const openModal = ()=>{
        setEditModal(true);
    }
    const closeModal = ()=>{
        setEditModal(false);
        id_load();

    }

    // url
    const outsideWindow =(url:string)=>{
        window.open(url)
    }



    // イベント削除
    const eventDelete = ()=>{
        axios.delete('http://localhost:8080/api/events/'+now)
        .then((response)=>{
            console.log(response.data);
            setId(0);
        }).catch((error)=>{
            console.log(error)
        })
    }


    function id_load(){
        axios.get('http://localhost:8080/api/events/'+id)
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
    },[id])
    useEffect(()=>{
        console.log(event.child)
        if(event.child != 0){
        axios.get('http://localhost:8080/api/events/child/'+id)
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
        setParent(id);
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
        setNow(id);
        setLoad(false);
    }



    return(
        <div id="event_wrapper" className="m-5 max-h-[550px] min-h-[200px] h-4/5 md:h-full ">
            <div className="flex flex-row gap-5 mb-5">
                <button onClick={()=>setId(0)} className="border-2 border-teal-700 hover:bg-teal-700 hover:text-white">一覧に戻る</button>
                {parent!= 0 &&
                    <button onClick={()=>returnParent()} className="bg-teal-700 text-white">親イベントに戻る</button>
                }

            </div>
            {load == true?(
                <div id="event_detail" className="flex flex-col justify-center items-center py-3">
                    <p className="text-xl mb-2 mx-5 w-4/5 text-wrap">{event.title}</p>
                    <h3>カテゴリ</h3>
                    <div id="categories" className="flex flex-row justify-center gap-2">
                    {event.category.map((catName,catKey)=>(
                        <p key={catKey} className="p-2.5 border border-teal-800 rounded-xl mb-5">{catName}</p>
                    ))}
                    </div>
                    {/* <h2>{event.create_user}</h2> */}
                    <h3>日時</h3>
                    <p>{event.open_date.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} {event.start_time} ~ {event.close_date.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} {event.end_time}</p>
                        <h3>場所</h3>

                    
                    <p>{event?.place}:{event?.address}</p>
                    <div className=" flex flex-row gap-5 justify-center items-center mb-5">
                    {event.address!="" &&
                        <Geocode locate={event.address}/>
                    }
                    {event.place!="" &&
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
                        <div key={c.id} className="flex items-center justify-center ">
                            <p className="text-teal-400 text-lg">●</p>
                            <button onClick={()=>changeChild(c.id)}><p  className="hover:border-b-2">{c.title}</p></button>
                            </div>
                    ))}

                    
                    {/* 編集モーダル */}
                    <Modal
                    isOpen={editModal}
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
                        }}>
                        <EventEdit event={event} modal={setEditModal}></EventEdit>
                    </Modal>
                    {/* 子イベントモーダル */}
                    <Modal
                    isOpen={childmodal}
                    onRequestClose={closeChild}
                        style={{
                            overlay:{
                                position: 'fixed',
                                top:0,
                                left:0,
                                right:0,
                                bottom:0,
                                zIndex:2000
                            }  
                        }}>
                            <CreateChildEvent open={event.open_date} close={event.close_date} start={event.start_time} end={event.end_time} parent={event.event_id} modal={setChildModal}/>
                        </Modal>

                </div>
            ):(
                <div id="load_detail" className="flex items-center justify-center">
                    <p className="text-gray-500 text-2xl">読み込み中・・・</p>
                </div>
            )}
            <div className="flex flex-row gap-1.5 justify-center mb-20">
                {parent == 0 &&
                <button onClick={openChild} className="border-2 border-teal-900 hover:bg-teal-900 hover:text-white">子イベントを作成</button>
                }
                <button onClick={openModal} className="border-2 border-teal-900 hover:bg-teal-900 hover:text-white">編集</button>
                <button onClick={eventDelete} className="bg-teal-900 text-white">削除</button>
            </div>

        </div>
    )
}