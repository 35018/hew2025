import {useState,useEffect} from 'react';
import axios from 'axios';
import PlaceInput from '../Map/placeInput';


    type Category ={
        category_id:number,
        category_name:string
    }
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
//     type Addresstype ={
//     address_id:number,
//     place_name:string,
//     address:string,
//     explanatory:string
// }

    type ModalProp ={
        modal:React.Dispatch<React.SetStateAction<boolean>>
    }
    

export default function CreateEvent({modal}:ModalProp){
    // cookie
    const [id,setId] = useState('')

    // formの値
    const [name,setName] = useState('');
    const [open_date,setOpendate] = useState('');
    const [close_date,setClosedate] = useState('');
    const [start_time,setStarttime] = useState('00:00:00');
    const [end_time,setEndtime] = useState('00:00:00');
    const [address,setAddress] = useState('');
    const [place,setPlace] = useState('');
    const [ex,setEx] = useState('');
    const [cat,setCat] = useState('0');
    const [url,setUrl] = useState('');
    const [link_name,setLinkName] = useState('')

    // アドレス値
    // const [addresslist,setAddressList] = useState([])
    // カテゴリ値
    const [categoryList,setCategoryList] = useState([])
        // エラーハンドル
    const [titleError,setTitleError] = useState(false)
    const [dateError,setDateError] = useState(false)
    const [urlError,setUrlError] = useState(false)


    const post:EventProps ={
        create_user:id,
        parent_event:null,
        event_name:name,
        open_date:open_date + " "+start_time,
        close_date:close_date + " "+end_time,
        start_time:start_time,
        end_time:end_time,
        address_name:address,
        address_place:place,
        explanatory:ex,
        category:cat,
        link_name:link_name,
        url:url
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

    // 簡易データ入力
    function TestDataInput(){
        setName("HAL EVENT WEEK")
        // 2026-02-17
        setOpendate("2026-03-10")
        setClosedate("2026-03-10")
        setStarttime("9:30:00")
        setEndtime("13:30:00")
        // hal大阪
        setAddress("HAL名古屋")
        setEx("来てくれてありがとうのココロ")
        setCat("12")
        // HALのHP 大阪会場の時は大阪会場に変える
        // https://www.hal.ac.jp/osaka
        setUrl("https://www.hal.ac.jp/nagoya")
        setLinkName("HAL名古屋公式")
    }




    const handleSubmit=(e)=>{
        e.preventDefault();
        setTitleError(name.trim().length === 0)
        setDateError(open_date.trim().length === 0)
        console.log(name.trim().length === 0)
        console.log(open_date.trim().length === 0)
        if(name.trim().length=== 0){
            setName("無題")
        }
        if(titleError == false && dateError == false && urlError == false){
            
            console.log(post)

            axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            axios.post('http://localhost:8080/api/events',post)
                .then((response)=>{
                    console.log('通信完了',response.data)
                    modal(false)
                })
                .catch((error)=>{
                    console.log("通信失敗",error)
                })
        }else{
            console.log('入力不足')
        }
    }
    
    // 日付揃え
    function closedateSet(date:string){
        setOpendate(date)
        if(close_date == ''){
                setClosedate(date)
            }
    }
    // URLチェック
    function URLcheck(url:string){
        setUrl(url)
        if(URL.canParse(url)){
            setUrlError(false)
        }else{
            setUrlError(true)
        }
    }


    return(
        <form className='flex flex-col items-center rounded-2xl w-2/3 m-auto' onSubmit={handleSubmit}>
        
        <label htmlFor="eveTitle">名前</label>
        {titleError &&<p className="text-red-800 text-xs">入力してください</p>}

        <input type="text" name="eveTitle" id="eveTitle" value={name} onChange={(e)=>setName(e.target.value)}/>

        <label htmlFor="start">開始時間</label>
        {dateError &&<p className="text-red-800 text-xs">入力してください</p>}

        <input type="date" name="open_date" id="open_date" value={open_date} onChange={(e)=>closedateSet(e.target.value)} />
        <input type="time" name="start_time" id="start_time" value={start_time} onChange={(e)=>setStarttime(e.target.value)} />

        <label htmlFor="end">終了時間</label>
        <input type="date" name="close_date" id="close_date" value={close_date} onChange={(e)=>setClosedate(e.target.value)}/>
        <input type="time" name="end_time" id="end_time" value={end_time} onChange={(e)=>setEndtime(e.target.value)} />
        <label htmlFor="address">場所名</label>
        <div className='flex flex-row gap-3'>
        <input type="text" name="address" id="address" value={address} onChange={(e)=>setAddress(e.target.value)}/>
        <PlaceInput address={address} setPlace={setPlace}/>
        </div>
        <label htmlFor="place">住所</label>
        <textarea  name="place" id="place" className='border-2 w-2/3 h-20 mb-5' value={place} onChange={(e)=>setPlace(e.target.value)}/>

        <label htmlFor="category">カテゴリー</label>
        <select className='mb-10 p-3 border-2 rounded' name="category" id="category" value={cat} onChange={(e)=>setCat(e.target.value)}>
            <option className='mb-2 border-2' value="0">カテゴリを選択</option>
            {categoryList.map((category:Category)=>(
                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
            ))}
        </select>
        
        <label htmlFor="link_name">リンク名</label>
        <input type="text" name="link_name" id="link_name" value={link_name} onChange={(e)=>setLinkName(e.target.value)}/>
        <label htmlFor="link">URL</label>
        {urlError &&<p className="text-red-800 ">URLが正しくありません</p>}
        <input type="text" id='link' name='link' value={url} onChange={(e)=>URLcheck(e.target.value)} />

        <label htmlFor="inst">説明</label>
        <textarea name="inst" id="inst" value={ex} onChange={(e)=>setEx(e.target.value)} className='border-2 w-2/3 h-20 mb-5'></textarea>
        <p className='text-teal-200 text-xs' onClick={TestDataInput}>オート充填</p>
        <button type="submit" className='bg-teal-800 text-white font-bold'>追加</button>
    </form>
    )

}