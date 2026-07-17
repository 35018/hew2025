import { useState,useEffect } from "react";
import axios from "axios";

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

    
type EventsProps = {
        setDetail:React.Dispatch<React.SetStateAction<number>>
    };

export default function Event_list({setDetail}:EventsProps){
    const [eventList,setEventList] = useState([])
    const [load,setLoad] = useState(false)
    const [category,setCategory] = useState("")

    const [search,setSearch] = useState("name")
    const [keyword,setKeyword] = useState("")
    const [cookie,setCookie] = useState("")

    // ページネーション表示
    const [startObj,setStartObj] = useState(0)
    const [per,setPer] = useState(5)
    const [endObj,setEndObj] = useState(per)

    // 検索オプション
    useEffect(()=>{
        // クッキー取得
        const cookies = document.cookie.split(";")
            cookies.forEach(cookie=>{
                const keyval = cookie.split("=");
                if(keyval[0].trim()=="user"){
                    setCookie(keyval[1])
            axios.get(`http://localhost:8080/api/events/list/${keyval[1]}`)
                .then((response)=>{
                    console.log(response.data);
                    setEventList(response.data);
                    setLoad(true);
                }).catch((error)=>{
                    console.log(error);
                    
                },)
                }
            })
        

    
},[]);

// カテゴリ検索
    useEffect(()=>{
        if(category != ""){
        // クッキー取得
            console.log(`http://localhost:8080/api/events/category/${cookie}/${category}`)
            axios.get(`http://localhost:8080/api/events/category/${cookie}/${category}`)
                .then((response)=>{
                    console.log(response.data);
                    setEventList(response.data);
                    setLoad(true);
                }).catch((error)=>{
                    console.log(error);
                    
                },)
                
        }else if(load ==true){
            axios.get(`http://localhost:8080/api/events/list/${cookie}`)
                .then((response)=>{
                    console.log(response.data);
                    setEventList(response.data);
                    setLoad(true);
                }).catch((error)=>{
                    console.log(error);
                    
                },)
        }
    },[category])


        // 文字検索
    function searchBtn(){
        if(keyword !=""){
        console.log(`http://localhost:8080/api/events/search/${cookie}/${search}/${keyword}`)
        const url = (`http://localhost:8080/api/events/search/${cookie}/${search}/${keyword}`)
            axios.get(url)
            .then((response)=>{
                console.log(response.data);
                setEventList(response.data);
                setStartObj(0);
                setEndObj(per);
                setLoad(true);
            }).catch((error)=>{
                console.log(error);
                
            },)  
        }  
    }

    function reload(){ 
        axios.get(`http://localhost:8080/api/events/list/${cookie}`)
            .then((response)=>{
                console.log(response.data);
                setEventList(response.data);
                setStartObj(0);
                setEndObj(per);
                setLoad(true);
            }).catch((error)=>{
                console.log(error);
                
            },)
        setKeyword("")
        // setCategory("")

    }

    // ページネーション
    function pageNext(){
        if(startObj+per< eventList.length){
        setStartObj(startObj+per)
        setEndObj(endObj+per)
        }
        if(endObj+per >= eventList.length){
            setEndObj(eventList.length)
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
        <div id="wrapList"  className="m-10 max-h-[550px] min-h-[200px] w-5/6">
            <div id="search_space" className="flex flex-row flex-wrap justify-between mb-10">
            <input type="text" className="border-2 w-3/5" value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
            <select name="select_search" id="select_search" defaultValue={"name"} onChange={(e)=>setSearch(e.target.value)}>
                <option value="name" defaultChecked>名前</option>
                <option value="place">場所名</option>
                <option value="address">住所</option>
            </select>
            
            <button type="button" className="bg-teal-800 text-white" onClick={searchBtn}>絞り込み</button>
            <select name="select_cat" id="select_cat" value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value="" defaultChecked>カテゴリ</option>
                <option value="1">移動</option>
                <option value="2">自然</option>
                <option value="3">公園</option>
                <option value="4">遊園地</option>
                <option value="5">美術館</option>
                <option value="6">博物館</option>
                <option value="7">動物園</option>
                <option value="8">水族館</option>
                <option value="9">劇場</option>
                <option value="10">宿泊</option>
                <option value="11">飲食店</option>
                <option value="12">その他</option>
                <option value="0">なし</option>
            </select>
            <button onClick={reload}>リセット</button>
            </div>
            {load == true ?(
                <div id="eventList" className="overflow-x-scroll h-3/5 md:h-auto mx-3">
                    {Array.isArray(eventList) &&eventList.slice(startObj,startObj+per).map((event:Event)=>(

                        <div key={event.id} className="flex flex-row items-center p-2 border-2 mb-2 border-teal-700 hover:bg-teal-700 hover:text-white" onClick={()=>setDetail(event.id)}>
                            
                            <p className="w-80 py-2 mr-1 align-middle truncate">{event.title}</p>
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
                    <div id="page">
                    全{eventList.length}件
                    {eventList.length > per &&
                        <div id="page_btn"className="flex flex-row justify-center items-center font-bold gap-2">
                            <button onClick={pagePrev} className="arrow hover:bg-teal-900 hover:text-white  hover:underline">＜</button>
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
