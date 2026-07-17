import React, { useEffect,useState, type SetStateAction } from "react";
import axios from "axios";

type listObject = {
    id:number,
    title:string,
    start:string,
    end:string,
    category:string[],
    address:string
}


type Prop ={
    setDetail:React.Dispatch<SetStateAction<number>>
}


export default function Object_list({setDetail}:Prop){
    const setId = (set:number) => setDetail(set)
    const [objects,setObjects] = useState([])
    const [load,setLoad] = useState(false);
    const [category,setCategory] = useState("");
    const [keyword,setKeyword] = useState("");
    const [search,setSearch] = useState("name");

    // ページネーション表示
    const [startObj,setStartObj] = useState(0)
    const [per,setPer] = useState(3)
    const [endObj,setEndObj]= useState(per) 

    useEffect(()=>{
        
        axios.get('http://localhost:8080/api/objects/list')
        .then((response)=>{
            console.log(response.data);
            setObjects(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
    
},[]);
    useEffect(()=>{
        if(category!=""){
            axios.get(`http://localhost:8080/api/objects/category/${category}`)
            .then((response)=>{
                console.log(response.data)
                setObjects(response.data)
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            axios.get('http://localhost:8080/api/objects/list')
            .then((response)=>{
                console.log(response.data);
                setObjects(response.data);
                setLoad(true);
            }).catch((error)=>{
                console.log(error);
                
            },)            
        }
    },[category])

    // 文字検索
    function searchBtn(){
        if(keyword !=""){
        console.log(`http://localhost:8080/api/objects/search/${search}/${keyword}`)
        const url = (`http://localhost:8080/api/objects/search/${search}/${keyword}`)
            axios.get(url)
            .then((response)=>{
                console.log(response.data);
                setObjects(response.data);
                setStartObj(0);
                setEndObj(per);
                setLoad(true);
            }).catch((error)=>{
                console.log(error);
                
            },)  
        }  
    }
    function reload(){        
        axios.get('http://localhost:8080/api/objects/list')
        .then((response)=>{
            console.log(response.data);
            setStartObj(0);
            setEndObj(per);
            setObjects(response.data);
        }).catch((error)=>{
            console.log(error);
            
        },)
        setKeyword("")
        setCategory("")

    }

    // ページネーション
    function pageNext(){
        if(startObj+per< objects.length){
        setStartObj(startObj+per)
        setEndObj(endObj+per)
        }
        if(endObj+per >= objects.length){
            setEndObj(objects.length)
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
        <div id="wrap_list"  className="m-10 max-h-[550px] min-h-[200px] w-5/6">
            
            <div id="search_space" className="flex flex-row flex-wrap justify-between mb-10">
                <input type="text" className="border-2 w-3/5" value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
                <select name="select_search" id="select_search" defaultValue={"name"} onChange={(e)=>setSearch(e.target.value)}>
                    <option value="name" defaultChecked>名前</option>
                    <option value="place">場所名</option>
                    <option value="address">住所</option>
                </select>
                
                <button type="button" className="bg-teal-800 text-white" onClick={searchBtn}>絞り込み</button>
                <select name="select_cat" id="select_cat" defaultValue="" onChange={(e)=>setCategory(e.target.value)}>
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
                <button id="reload" className="" onClick={reload}>リセット</button>
            </div>
            {load== true ? (
                <div id="object_list" className="m-10 w-full md:w-5/6 md:h-auto mx-3">
                    {objects.slice(startObj,startObj+per).map((object:listObject)=>(
                        
                        <div key={object.id} className="flex flex-col md:flex-row items-center border-2 mb-2 border-teal-700 hover:bg-teal-700 hover:text-white"  onClick={()=>setId(object.id)}>
                            <p className="w-80 md:w-50 my-2 md:m-5 text-ellipsis font-bold">{object.title}</p>
                            <div className="flex flex-col items-start justify-end">
                                <p className="w-50 ">開始:{object.start.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')}</p>
                                
                                <p className="w-50 mb-2 md:mb-0">最終日:{object.end.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')}</p>
                            </div>
                            <div className="w-50">
                            {object.category.map((item,index)=>(
                                <p className=" font-bold" key={index}>{item}</p>
                            ))}
                            </div>
                            <p className="w-80 mb-2 md:mb-0">{object.address}</p></div>
                    ))}
                    <div id="page">
                    全{objects.length}件
                    {objects.length > per &&
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