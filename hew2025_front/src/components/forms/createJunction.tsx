import { useState,useEffect } from "react";
import axios from "axios";

type SelectorType = {
    id:number,
    title:string
}
type SelectorList ={
    list:SelectorType[]
}

type PostType ={
    left:number,
    right:number
}


export default function CreateJunction(){
    const [objects,setObjects] = useState<SelectorList>()
    const [object_id,setObjectId] = useState(0)
    const [events,setEvents] =  useState<SelectorList>()
    const [event_id,setEventId] = useState(0)
    const [category,setCategory] = useState<SelectorList>()
    const [category_id,setCategoryId] = useState(0)
    const [links,setLinks] = useState<SelectorList>()
    const [link_id,setLinkId] = useState(0)
    const [load,setLoad]= useState(false)


    useEffect(()=>{
        axios.get('http://localhost:8080/api/links/')
        .then((response)=>{
            console.log(response.data);
            // setObject(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
    },[])

    function sendJunction(junction:string,left_id:number,right_id:number){

        const post:PostType={
            left:left_id,
            right:right_id
        }
        console.log(post,left_id,right_id)
    }

    return(
        <div>
        {load == true ?(
            <div id="juncWrap">
                <h1>中間テーブル追加</h1>
                <div>
                    <h2>イベント＿カテゴリ</h2>
                    
                    <button onClick={()=>{sendJunction('event_category',2,2)}}>追加</button>
                </div>
                <div>
                    <h2>イベント＿リンク</h2>
                </div>
                <div>
                    <h2>オブジェクト＿カテゴリ</h2>
                </div>
            </div>
        ):(
            <div id="loadJunc">
                <p className="text-2xl text-gray-500">読み込み中・・・</p>
            </div>
        )}
        </div>
    )
}

