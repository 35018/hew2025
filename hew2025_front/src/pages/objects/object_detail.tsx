import { useState,useEffect, type SetStateAction } from "react"
import Modal from 'react-modal';
import ObjectToEvent from "./object_to_event";
import axios from "axios";

import Geocode from "../../components/Map/geocode";

type ObjectDetailProps={
    id:number,
    setDetail:React.Dispatch<React.SetStateAction<number>>
}

type Object={
    object_id:number,
    object_name:string,
    created:string,
    start:string,
    end:string,
    open:string,
    close:string,
    category:string[],
    address_name:string,
    address:string,
    address_id:number,
    ex:string,
    link:string,
}

export type DetailProps ={
    obj:Object,
    modal:React.Dispatch<SetStateAction<boolean>>
}

export default function Object_detail({id,setDetail}:ObjectDetailProps){
    const [load,setLoad]= useState(false);
    const [object,setObject] = useState<Object>(
        {
            object_id:0,
            object_name:"",
            created:"",
            start:"",
            end:"",
            open:"",
            close:"",
            category:["",""],
            address_name:"",
            address:"",
            address_id:0,
            ex:"",
            link:""
        }
    )
    // 使用データ
    useEffect(()=>{
        axios.get('http://localhost:8080/api/objects/'+id)
        .then((response)=>{
            console.log(response.data);
            setObject(response.data);
            setLoad(true);
        }).catch((error)=>{
            console.log(error);
            
        },)
    },[])

    // フォームモーダル用
    const [modal,setModal] = useState(false)

        const openForm = () =>{
        setModal(true);
    }
    const colseForm = () =>{
        setModal(false);
    }

    function outsideWindow(url:string){
        window.open(url)
    }


    return(
        <div id="derail_wrapper" className="m-5 max-h-[550px] min-h-[200px] h-4/5 md:h-dvh mb-10">
            <div className="flex flex-row gap-5 mb-5">

            <button className="border-2 border-teal-700 hover:bg-teal-700 hover:text-white" onClick={()=>{setDetail(0)}}>戻る</button>
            </div>
            {load == true ?(
                <div className="flex flex-col items-center justify-center">
                    <p className="hidden" id="obj_id">{object?.object_id}</p>
                    <p className="text-xl mb-2 mx-5 w-4/5 text-wrap">{object?.object_name}</p>
                    {/* <h2 className="text-l mb-5">{object?.created}</h2> */}

                    {object.category.map((catName,index)=>(
                        <p key={index} className="p-2.5 text-xl border border-teal-800 rounded-xl mb-7">{catName}</p>
                    ))}
                    <h3 className="text-xl mb-2">会期</h3>
                    <p className="mb-2.5">{object?.start.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')} ~ {object?.end.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')}</p>
                    <p className=" mb-1">開場時間:{object.open}~{object.close}</p>

                    <h3 className="text-xl mb-2">会場情報</h3>
                    <p className="mb-1">会場:{object?.address_name}</p>
                    <p className="mb-1">住所:{object?.address}</p>
                    {object.address != "" &&
                    <div className="mb-5">
                    <Geocode locate={object?.address}/>

                    </div>
                    }
                    
                    <h3 className="text-xl mb-2">説明</h3>
                    <p className=" mb-5 whitespace-pre-wrap">{object?.ex}</p>
                    <h3 className="text-xl mb-2">公式HP</h3>
                    <p className="mb-5 hover:text-teal-500" onClick={()=>outsideWindow(object.link)}>{object.link}</p>

                    <button type="button" className="bg-teal-800 hover:bg-white text-white hover:text-teal-900 border-2 border-teal-900" onClick={openForm}>このイベントをカレンダーに登録</button>
                    <Modal
                        
                        isOpen={modal}
                        onRequestClose={colseForm}
                        style={{
                            content:{
                                
                            },
                            overlay:{
                                position: 'fixed',
                                top:0,
                                left:0,
                                right:0,
                                bottom:0,
                                zIndex:2000
                            }  
                        }}

                        >
                            <ObjectToEvent obj={object} modal={colseForm}/>
                    </Modal>
                </div>
            ):(
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">読み込み中・・・</div>
            )}

        </div>
    )
}