
import { useState,useEffect } from "react";
import axios from "axios";

type ObjectProps ={
    create_user:number,
    object_name:string,
    open_date:string,
    close_date:string,
    start_time:string,
    end_time:string,
    url:string,
    address:string,
    explanatory:string,
    category:string
}

type Address ={
    address_id:number,
    place_name:string,
    address:string,
    explanatory:string
}

export default function CreateObject(){
    // select用
    const [categories,setCategories] = useState([])
    const [addresslist,setAddressList] = useState([])

    // form送信用
    const [name,setName] = useState('')
    const [start,setStart]= useState('')
    const [end,setEnd] = useState('')
    const [start_time,setST] = useState('')
    const [end_time,setET] = useState('')
    const [address,setAddress] = useState('')
    const [url,setUrl] = useState('')
    const [ex,setEx] = useState('')
    const [cat,setCat] = useState('')

        useEffect(()=>{
        
        axios.get('http://localhost:8080/api/category')
        .then((response)=>{
            console.log(response.data);
            setCategories(response.data);

        }).catch((error)=>{
            console.log(error);
        },)

        axios.get('http://localhost:8080/api/address')
        .then((response)=>{
            console.log(response.data);
            setAddressList(response.data);

        }).catch((error)=>{
            console.log(error);
        },)
    
    },[]);

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(e);
        const post:ObjectProps = {
            create_user:1,
            object_name:name,
            open_date:start,
            close_date:end,
            start_time:start_time,
            end_time:end_time,
            url:url,
            address:address,
            category:cat,
            explanatory:ex

        };
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        axios.post('http://localhost:8080/api/objects',post)
            .then(response=>{
                console.log('通信完了',response.data)
            })
            .catch(error=>{
                console.log("通信失敗",error)
            })
    }


    return(

    <form action="" className="w-full flex flex-col items-center z-10" onSubmit={handleSubmit}>
        <div className="flex flex-col">
            <p>name:{name}</p>
            <p>date{start}~{end}</p>
            <p>time:{start_time}~{end_time}</p>
            <p>link:{url}</p>
            <p>address:{address}</p>
            <p>category:{cat}</p>
            <p>ex:{ex}</p>
        </div>
        <label htmlFor="name">名前</label>
        <input type="text" name="name" className="" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>

        <label htmlFor="start">開始日</label>
        <input type="date" name="start" id="start" value={start} onChange={(e)=>setStart(e.target.value)} />

        <label htmlFor="end">終了日</label>
        <input type="date" name="end" id="end" value={end} onChange={(e)=>setEnd(e.target.value)} />

        <p>時間</p>
        <label htmlFor="time_start" className="text-xs text-gray-500">開始時間</label>
        <input type="time" name="time_start" id="time_start" value={start_time} onChange={(e)=>setST(e.target.value)} />
        <label htmlFor="time_end" className="text-xs text-gray-500">終了時間</label>
        <input type="time" name="time_end" id="time_end" value={end_time} onChange={(e)=>setET(e.target.value)}/>

        <label htmlFor="link">公式サイト</label>
        <input type="text" name="link" id="link" className="w-xl" value={url} onChange={(e)=>setUrl(e.target.value)} />

        <label htmlFor="address">場所名</label>
        <select name="address" id="address" value={address} onChange={(e)=>setAddress(e.target.value)}>
            <option value="">---</option>
            {addresslist.map((address:Address)=>(
                <option key={address.address_id} value={address.address_id}>{address.place_name}</option>
            ))}
        </select>


        <label htmlFor="inst">説明</label>
        <textarea name="inst" id="inst" className="border-2 mb-2" value={ex} onChange={(e)=>setEx(e.target.value)}></textarea>

        <label htmlFor="category">カテゴリー</label>
        <select name="category" id="category" value={cat} onChange={(e)=>setCat(e.target.value)} >
            {categories.map((eve)=>(
                <option className="mb-2 border-2" value={eve.category_id} key={eve.category_id}>
                    {eve.category_name}
                </option>
            ))}
        </select>
        

        <button type="submit" className="flex text-white bg-teal-800 border-2 border-teal-800">登録</button>
    </form>
    )


}