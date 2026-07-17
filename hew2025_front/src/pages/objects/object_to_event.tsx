import { useState,useEffect } from "react"
import  type { DetailProps } from "./object_detail"
import axios from "axios"

    type EventProps = {
        create_user:string,
        parent_event:number | null,
        event_name:string,
        open_date:string,
        close_date:string,
        start_time:string,
        end_time:string,
        address_name:string,
        address_place:string,
        explanatory:string,
        category:string,
        link_name:string,
        url:string
    }

    type Category ={
        category_id:string,
        category_name:string
    }


export default function ObjectToEvent({obj,modal}:DetailProps){
    const [id,setId] = useState('')

    const [name,setName] = useState(obj.object_name)
    const [date,setDate] = useState('')
    const [start,setStart] = useState('')
    const [end,setEnd] = useState('')
    const [ex,setEx] = useState('')
    const [category,setCat] = useState('0')
    const [categoryList,setCategoryList] = useState([])
        // カテゴリがテキスト扱いなので入れ方を修正します
        const post:EventProps ={
        create_user:id,
        parent_event:null,
        event_name:name,
        open_date:date + " "+start,
        close_date:date + " "+end,
        start_time:start,
        end_time:end,
        address_name:obj.address_name,
        address_place:obj.address,
        category:category,
        explanatory:ex,
        link_name:"公式リンク",
        url:obj.link
    }

        useEffect(()=>{
        // クッキー取得
        const cookies = document.cookie.split(";")
            cookies.forEach(cookie=>{
                const keyval = cookie.split("=");
                if(keyval[0].trim()=="user"){
                    setId(keyval[1])
                }
            })
        // カテゴリ取得
        axios.get('http://localhost:8080/api/p_category')
        .then((response)=>{
            setCategoryList(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    
    },[]); 

    // カテゴリ番号照合
    useEffect(()=>{
        Object.values(categoryList). forEach(function(val:Category){
            // console.log(val.category_name,obj.category[0][0])
            if(val.category_name === obj.category[0][0]){
                setCat(val.category_id)
            }
        })       
    },[categoryList])

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        axios.post('http://localhost:8080/api/events/',post)
            .then(response=>{
                console.log('通信完了',response.data)
                modal(false);

            })
            .catch(error=>{
                console.log("通信失敗",error)
            })
    }

    return(

        <form className="flex flex-col justify-center items-center " onSubmit={handleSubmit}>
            {obj.object_name}
            <label htmlFor="name">イベント名称</label>
            <input type="text" name="name" id="name" value={name} onChange={(e)=>setName(e.target.value)} />

            <label htmlFor="date">日付</label>
            <input type="date" name="date" id="date" min={obj.start} max={obj.end} value={date} onChange={(e)=>setDate(e.target.value)} />

            <label htmlFor="start">開始時間</label>
            <input type="time" name="start" id="start" min={obj.open} max={obj.close} value={start} onChange={(e)=>setStart(e.target.value)}/>

            <label htmlFor="end">終了時間</label>
            <input type="time" name="end" id="end"  min={obj.open} max={obj.close} value={end} onChange={(e)=>setEnd(e.target.value)} />

            <label>場所</label>
            <p>{obj.address_name}</p>
            <p>住所:{obj.address}</p>
            <label htmlFor="ex">説明</label>
        <textarea name="inst" id="inst" value={ex} onChange={(e)=>setEx(e.target.value)} className='border-2 w-2/3 h-20 mb-5'></textarea>

            <button type="submit" className="bg-teal-800 text-white">追加</button>

        </form>
    )
}