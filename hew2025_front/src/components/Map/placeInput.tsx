import axios from "axios";
import { useState } from "react";

const MAP_API_KEY = '';

type setProps ={
    address:string,
    setPlace:React.Dispatch<React.SetStateAction<string>>
}



export default function PlaceInput({address,setPlace}:setProps){
    const [result,setResult] = useState("")
    async function search(){
        axios.post('https://places.googleapis.com/v1/places:searchText',{
            textQuery:address,
        },{
            headers:{
                'Content-Type':'application/json',
                'X-Goog-Api-Key':MAP_API_KEY,
                'X-Goog-FieldMask':'places.displayName,places.formattedAddress',
            },
        }
    )
        .then((response)=>{
            console.log(response.data.places[0].formattedAddress)
            setResult(response.data.places[0].formattedAddress)
            setPlace(response.data.places[0].formattedAddress.split('、')[1])


            }
        ).catch((error)=>{
            console.log(error)
        })
    }

    return(
        <div>
            <button type="button" className="text-[1rem] bg-teal-500 hover:bg-white p-2 text-white hover:text-teal-400 outline-0 hover:outline-2 outline-teal-400" onClick={search}>検索</button>
        </div>
    )
}