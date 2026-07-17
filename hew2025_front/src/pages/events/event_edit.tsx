import {useState,useEffect} from 'react';
import axios from 'axios';

type EventProps ={
    event_id:number,
    create_user:number,
    parent_event:number | null,
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
       
}

type UrlProp ={
    id:string,
    title:string,
    url:string
}

type EditProps={
    event:EventProps,
    modal:React.Dispatch<React.SetStateAction<boolean>>
}


export default function EventEdit({event,modal}:EditProps){
    // console.log(event)
    // formの値
    const [name,setName] = useState(event.title);
    const [open_date,setOpendate] = useState(event.open_date);
    const [close_date,setClosedate] = useState(event.close_date);
    const [start_time,setStarttime] = useState(event.start_time);
    const [end_time,setEndtime] = useState(event.end_time);
    const [address,setAddress] = useState(event.address);
    const [place,setPlace] = useState(event.place);
    const [ex,setEx] = useState(event.ex);
    const [cat,setCat] = useState(event.category);
    const [url,setUrl] = useState(event.url);

    // 追加処理用
    const [addCat,setAddCat] = useState(1);
    const [addlinkname,setAddLinkname]= useState('');
    const [addUrl,setAddUrl] = useState('');

    const [catList,setCatList]= useState([]);

    const [urlError,setUrlError] = useState(false)



    useEffect(()=>{
        axios.get('http://localhost:8080/api/category')
        .then((response)=>{
            setCatList(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[])

    // カテゴリ追加
    function categoryAdd(){
        // console.log(addCat)
        const id_category = {
            id:event.event_id,
            category:addCat
            
        }
        console.log(id_category)
        axios.post('http://localhost:8080/api/event_category',id_category)
            .then((response)=>{
                console.log(response.data)
                setCat(response.data)
            }).catch((error)=>{
                console.log(error)
            })
    }
    // カテゴリ削除
    function categoryDel(name:string){
        const url = 'http://localhost:8080/api/event_category/'+event.event_id+'/'+name
        axios.delete(url)
        .then((response)=>{
            setCat(response.data)
        }).catch((error)=>{

            console.log(error.message)
        })
    }

    // URLチェック
    function URLcheck(url:string){
        setAddUrl(url)
        if(URL.canParse(addUrl)){
            setUrlError(false)
        }else{
            setUrlError(true)
        }
    }

    // リンク追加
    function linkAdd(){
        if(urlError == false){
            const id_link = {
                id:event.event_id,
                link:addUrl,
                title:addlinkname
            }
            axios.post('http://localhost:8080/api/event_link',id_link)
            .then((response)=>{
                setUrl(response.data)
            }).catch((error)=>{
                console.log(error.message)
            })
        }
    }
    // リンク削除
    function linkDel(url:string){
        // urlのidを取得
        const sendurl = {url:url}
        console.log(sendurl)
        axios.post('http://localhost:8080/api/link_id/',sendurl)
        .then((response)=>{
            const url_id = response.data
            const del_url = 'http://localhost:8080/api/event_link/'+event.event_id+'/'+url_id
            axios.delete(del_url)
                .then((response)=>{
                    setUrl(response.data)
                })
                .catch((error)=>{
                    console.log(error)
                })



        }).catch((error)=>{
            console.log(error.message)
        })




        

    }

    // データ上書き
    function handleSubmit(e){
        e.preventDefault();

        const post={
            id:event.event_id,
            event_name:name,
            open_date:open_date+" "+start_time,
            close_date:close_date+" "+end_time,
            start_time:start_time,
            end_time:end_time,
            address_name:place,
            address_place:address,
            ex:ex,

        }
        console.log(post)
        axios.post('http://localhost:8080/api/events/update',post)
        .then((request)=>{
            console.log(request.data)
            modal(false)
            
        })
        .catch((error)=>{
            console.log(error)
        })
        
    }
    


    return(
        <div id='wrap'>
            <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                <label htmlFor="title" >タイトル</label>
                <input type="text" name='title' id='title' value={name} onChange={(e)=>setName(e.target.value)} />

                <label htmlFor="start">開始時間</label>
                <input type="date" name="open_date" id="open_Date" value={open_date} onChange={(e)=>setOpendate(e.target.value)}/>
                <input type="time" name="start_time" id="start_timme" value={start_time} onChange={(e)=>setStarttime(e.target.value)}/>

                <label htmlFor="start">開始時間</label>
                <input type="date" name="close_date" id="close_Date" value={close_date} onChange={(e)=>setClosedate(e.target.value)}/>
                <input type="time" name="end_time" id="end_timme" value={end_time} onChange={(e)=>setEndtime(e.target.value)}/>

                <label htmlFor="place">場所</label>
                <input type="text" name="place" id="place" value={place} onChange={(e)=>setPlace(e.target.value)} />

                <label htmlFor="addres">住所</label>
                <input type="text" name="address" id="address" value={address} onChange={(e)=>setAddress(e.target.value)}/>

                <h2>カテゴリタグ</h2>
                {cat.map((catName,catKey)=>(
                    <div key={catKey} className='flex flex-row mb-1'>
                        <p className='mr-2 border border-teal-800 rounded-x: p-2.5'>{catName}</p>
                        <button type='button' className='border text-white bg-teal-800 p-1.5' onClick={()=>categoryDel(catName)}>×</button>
                    </div>
                ))}
                <div className='flex flex-row'>
                    <select name="category" id="category" className='border-2 rounded-lg mr-5' value={addCat} onChange={(e)=>setAddCat(e.target.value)}>
                        {catList.map((category)=>(
                            <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                            
                        ))}
                    </select>
                    <button type='button' onClick={()=>categoryAdd()} className='bg-teal-500 text-white'>カテゴリ追加</button>

                </div>

                <h2>リンク</h2>
                {url.map((link:UrlProp)=>(
                    <div  key={link.id} className='flex flex-row justify-center'>
                        <p>{link.title} <br/>{link.url}</p> 
                        <button type='button' className='border text-white bg-teal-800' onClick={()=>linkDel(link.url)}>x</button>
                    </div>
                ))}
                <label htmlFor="linkname">リンク名</label>
                <input type="text" name="linkname" id="linkname" value={addlinkname} onChange={(e)=>setAddLinkname(e.target.value)} className='min-w-3/5'/>
                <label htmlFor="link">URL</label>
                {urlError &&<p className="text-red-800 text-xs">URLが正しくありません</p>}
                <input type="text" name="link" id="link" value={addUrl} onChange={(e)=>URLcheck(e.target.value)} className='min-w-3/5'/>
                <button type='button' onClick={()=>linkAdd()} className='bg-teal-400 text-white'>リンク追加</button>
                <label htmlFor="ex">説明</label>
            <textarea name="inst" id="inst" value={ex} onChange={(e)=>setEx(e.target.value)} className='border-2 w-2/3 h-20 mb-5'></textarea>
                <button type="submit" className='bg-teal-900 text-white'>更新</button>
            </form>
        </div>
    )
}