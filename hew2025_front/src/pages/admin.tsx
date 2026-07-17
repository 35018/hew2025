
import {useState} from 'react';
import CreateAdress from "../components/forms/createAdress";
import CreateObject from "../components/forms/createObject";
import CreateEvent from '../components/forms/createEvent';


// データベースへの追加テスト
export default function Admin(){
    const [mode,setMode] = useState('address');

    return(
        <div id="wrapper">
            <p>追加フォームまとめ:{mode}</p>
            <div id='buttons' className='flex w-full justify-evenly items-center'>
                <button className='bg-teal-400' onClick={()=>setMode('address')}>address</button>
                <button className='bg-teal-400' onClick={()=>setMode('object')}>objects</button>
            </div>

            {mode == 'address' && 
            <div id='addressWrap'>
            <h2>Ardessテーブル</h2>
            <p>登録された住所</p>
            <CreateAdress/>
            </div>
            }
            {mode == 'object' &&
            <div>
                <h2>Objectテーブル</h2>
                <p>イベントを探して自分のイベントにするためのオブジェクト</p>
                <CreateObject/>
            </div>
            }

        </div>
        

        

    )
}