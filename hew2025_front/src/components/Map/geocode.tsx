// react-google-maps/api版
import { useState,useMemo } from 'react';
import { GoogleMap,useJsApiLoader,Marker } from '@react-google-maps/api';

const MAP_API_KEY = 'AIzaSyA2RqH8XL-K7vhQ4fvCncH6s4owh3TbRW8';

type mapProp={
    locate:string
}



export default function Geocode({locate}:mapProp){

    const {isLoaded} = useJsApiLoader({
        // id: 'c9188be16569c3406348db63',
        googleMapsApiKey:MAP_API_KEY,
    })
    const [lat,setLat] = useState(0)
    const [lng,setLng] = useState(0)

      const options = useMemo(() => ({
            streetViewControl: false,
            // マップタイプコントロール（航空写真と地図の切り替え）を非表示
            mapTypeControl: false,
            // スケールコントロール（縮尺表示）を非表示
            scaleControl: false,
            // フルスクリーンコントロール（右下の拡大ボタン）を非表示
            fullscreenControl: false,
        }), []);


    function geocode(){
            if(!window.google || !window.google.maps){
                console.log("GoogleMapAPIが読み込み中")
            return;
        }
        const geocoder= new window.google.maps.Geocoder();

        geocoder.geocode({address:locate},(results,status)=>{
            if(status === 'OK' && results){
                setLat(results[0].geometry.location.lat());
                setLng(results[0].geometry.location.lng());
            }
    });
    }
    function reload(){
        console.log(isLoaded)
        geocode()
    }
    function close(){
        setLat(0)
        setLng(0)
    }

    return(

        <div>
            {isLoaded && lat!=0 && lng != 0?(
                <div className='flex justify-center mb-10'>
                    <button type='button' className='text-xs h-[30px] w-30px bg-teal-900 text-white mb-5' onClick={close}>x</button>
                    <GoogleMap
                        mapContainerStyle={{width:"300px",height:"300px"}}
                        center={{lat:lat,lng:lng}}
                        zoom={15}
                        onLoad={geocode}
                        options={options}
                    >
                        <Marker position={{lat:lat,lng:lng}}/>
                    </GoogleMap>

                </div>

            ):(
                <button type='button' onClick={reload} className='bg-teal-800 text-white'>地図を表示</button>
            )}
        </div>
    )
}