import axios from 'axios'
import {useState,useEffect} from 'react'

type viewAddress ={
    id:number,
    place:string,
    address:string
}

type Prop={
    setAddressId:React.Dispatch<React.SetStateAction<number>>
}

export default function SearchAddress({setAddressId}:Prop){

    const [keyword,setKeyword] = useState('')
    const [addressList,setList] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:8080/api/address')
        .then((response)=>{
            setList(response.data);
        }).catch((error)=>{
            console.log(error);
        })
    },[])

    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.get('http://localhost:8080/api/address/search/'+keyword)
        .then((response)=>{
            setList(response.data)
        }).catch((error)=>{
            console.log(error)
        })
        
    }



    return(
        <div>
            <form method='get' action="#" onSubmit={handleSubmit}>
            <p>住所検索</p>
            <input type="text" name='search' id='search' value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
            <input type="radio" name="target" id="address" value="address"/><label htmlFor="address">住所</label>
            <input type="radio" name="target" id="place" value="place"/><label htmlFor="place">名称</label>
            <button type='submit'>検索</button>
            </form>

            <div>
                {addressList.map((address:viewAddress)=>(
                    <button key={address.id} onClick={()=>setAddressId(address.id)}>{address.place}:{address.address}</button>
                ))}
            </div>

        </div>
    )
}