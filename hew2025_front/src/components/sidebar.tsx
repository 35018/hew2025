"use client"
import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import CreateEvent from './forms/createEvent';
import { useNavigate } from 'react-router-dom';

import logo from './icon/app_icon.svg'

type stateProps = {
    status:string,
    setState:React.Dispatch<React.SetStateAction<string>>
    userName:string,
    setUserName:React.Dispatch<React.SetStateAction<string>>

}


export default function Sidebar({status,setState,userName,setUserName}:stateProps){
    const navigate= useNavigate()

    useEffect(()=>{
    const cookie_list = document.cookie.split(";")
        console.log(cookie_list)
        if(cookie_list[0]==""){
            console.log("ログアウト状態")
            navigate('/')

        }
        cookie_list.forEach(cookie => {
        const keyval = cookie.split("=")
        if(keyval[0].trim()=="name"){
            setUserName(keyval[1])
        }
    });
    },[])

    // modal
    const [modalIsOpen,setIsOpen] = useState(false);

    const openObj = () =>{
        setIsOpen(true);
    }
    const colseObj = () =>{
        setIsOpen(false);
    }
    function logout(){
        document.cookie="user=; max-age=0"
        document.cookie="name=; max-age=0"
        navigate('/');
    }

    return(
            <section id="sidemenu" className=" bg-teal-300 h-[200;x] md:h-full px-3.5 w-full flex flex-row justify-between md:justify-center items-center absolute md:static bottom-0 md:flex-col">
                <div className='flex flex-col justify-center items-center mr-5 md:mr-0'>
                    <img src={logo} alt="とらべりん" height={120} width={120}/>
                    <p id="viewUserName" className="text-[0.7rem] md:text-lg font-bold mb-5 mx-5 py-2.5">{userName}</p>
                </div>
                {/* {status} */}
                                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={colseObj}
                    style={{
                        content:{
                            border: '2px solid #ccc',
                            padding:'20px',
                            maxWidth:750,
                            margin:'auto'
                        },
                        overlay:{
                            position: 'fixed',
                            top:0,
                            left:0,
                            right:0,
                            bottom:0,
                            zIndex:2000,
                            backgroundColor:'rgba(167, 167, 167, 0.75)',
                        }  
                    }}
                    >
                    <CreateEvent modal={setIsOpen}  />
                </Modal>
                <div id="buttons" className="mx-auto flex flex-row md:flex-col flex-wrap  justify-between md:justify-center items-center gap-1.5 md:gap-0">
                
                {status != 'monthly' ? 
                    (<button className='w-[100px]  md:w-full text-xs md:text-lg bg-white/80 text-teal-950 my-2.5 hover:inset-shadow-teal-800 outline-teal-900 outline-0 hover:outline-2' onClick={()=>{setState('monthly')}}>カレンダー</button>)
                    :(<button disabled className='w-[100px] md:w-full text-xs md:text-lg bg-gray-500/50 text-teal-950/50 my-2.5 outline-2 outline-teal-800/70' onClick={()=>{setState('monthly')}}>カレンダー</button>)

                }
                {status != 'searchObj' ?
                    (<button className="w-[110px]  md:w-full text-xs md:text-lg bg-white/80 text-teal-950 my-2.5 outline-teal-900 outline-0 hover:outline-2"onClick={()=>setState('searchObj')} >イベントを探す</button>)
                    :(<button disabled className="w-[110px]  md:w-full text-xs md:text-lg bg-gray-500/80 text-teal-950/50 my-2.5 outline-2 outline-teal-800/70"onClick={()=>setState('searchObj')} >イベントを探す</button>)
                }
                {status != 'eventlist' ?
                    (<button className="w-[100px]  md:w-full text-xs md:text-lg bg-white/80 text-teal-950 my-2.5  outline-teal-900 outline-0 hover:outline-2" onClick={()=>{setState('eventlist')}} >マイイベント</button>)
                    :(<button disabled className="w-[100px]  md:w-full text-xs md:text-lg bg-gray-500/80 text-teal-950/50 my-2.5 outline-2 outline-teal-800/70"onClick={()=>setState('eventlist')} >マイイベント</button>)
                    
                }
                <button className="w-[100px] border-2 border-teal-900 md:w-full text-xs md:text-lg bg-teal-950/80 hover:bg-white text-white hover:text-teal-900/80 my-2.5" onClick={openObj}>追加</button>
                
                <div className='flex flex-row flex-wrap gap-1'>
                <button className='bg-white text-teal-950 h-7 md:h-10 w-20 text-xs ' onClick={()=>setState('config')}>設定</button>
                <button type='button' className='bg-white text-teal-950 h-7 md:h-10 w-20 text-xs ' onClick={logout}>ログアウト</button>
                </div>
                </div>
                </section>
                

    )
}