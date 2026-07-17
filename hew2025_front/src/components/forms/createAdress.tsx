'use client'

import React, { useState,useEffect } from 'react';
import axios from 'axios';

type addresstype ={
    name:string,
    address:string,
    ex:string
}

export default function CreateAdress(){


    const [list,setList] = useState([])
    const [name,setName] = useState('');
    const [address,setAddress]= useState('');
    const [ex,setEx] = useState('');

        useEffect(()=>{
            
            axios.get('http://localhost:8080/api/address')
            .then((response)=>{
                console.log(response.data);
                setList(response.data);

            }).catch((error)=>{
                console.log(error);
            },)
        
    },[]);

    // API送信
    const handleSubmit = (e) =>{
        e.preventDefault();
        const post:addresstype = {name:name,address:address,ex:ex};
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        axios.post('http://localhost:8080/api/address',post)
            .then(response=>{
                console.log('作成完了',response.data)
            })
            .catch(error=>{
                console.log("失敗",error)
            })
    }
    return(
        <form onSubmit={handleSubmit}>
            {list.map((ad)=>(
                <div key={ad.address_id}><p>{ad.address_id}:{ad.place_name}:{ad.address}:{ad.explanatory}</p></div>
            ))}
            <label htmlFor="name">名前</label>
            <input type="text" name="name" id="name" value={name} onChange={(e)=>{setName(e.target.value)}}/>

            <label htmlFor="adress">住所</label>
            <input type="text" name="adress" id="adess" value={address} onChange={(e)=>{setAddress(e.target.value)}}/>
            <label htmlFor="ex">説明</label>
            <input type="text" name="ex" id="ex" value={ex} onChange={(e)=>{setEx(e.target.value)}}/>
            {name}
            {address}
            {ex}

            <button type="submit">登録</button>
        </form>
    );
}