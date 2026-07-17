import axios from "axios"
import { useState,useEffect } from "react"
import Log from "./log"

type configProp ={
    setUserName:React.Dispatch<React.SetStateAction<string>>
}

type userProp ={
    user_id:string,
    user_name:string,
    email:string,
    password:string,
    birthday:string
}

export default function Config({setUserName}:configProp){
    const [userid,setUserId] = useState('')
    const [mode,setMode] = useState("user")
    const [userData,setUserData]=useState<userProp>({
        user_id:"",
        user_name:"",
        email:"",
        password:"",
        birthday:""
    })

    // user_update用
    const [newname,setNewName] = useState("")
    const [email,setEmail] = useState('')
    const [pass,setPass] = useState('')
    const [newPass,setNewPass] = useState('')
    const [birthday,setBirthday] = useState('')

    // フラグ
    const [newPassFlg,setNewPassFlg] = useState(false)
    const [checkPass,setCheckPass] = useState(false)
    const [mailflg,setMailFlg] = useState(false)

    function getUserData(){
        axios.get('http://localhost:8080/api/user/'+userid)
        .then((response)=>{
            console.log(response.data)
            setUserData(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })

    }

    useEffect(()=>{
        // id取得
    const cookie_list = document.cookie.split(";")
        cookie_list.forEach(cookie => {
        const keyval = cookie.split("=")
        if(keyval[0].trim()=="user"){
            setUserId(keyval[1])
        }
    });
    },[])

    useEffect(()=>{
        getUserData();

    },[userid])

    function update_set(){
        console.log(userData.user_name)
        setMode("update")
        setNewName(userData.user_name)
        setEmail(userData.email)
        setBirthday(userData.birthday)
    }

    // 新パスワード入力切替
    function switchNewPass(){
        if(newPassFlg){
            setNewPass("");
            setNewPassFlg(false);
        }else{
            setNewPassFlg(true);
        }
    }

    // 更新
    function handleSubmit(e){
        e.preventDefault();
        setCheckPass(false);
        if(pass != userData.password){
            setCheckPass(true)
        }else{
        // メールアドレス確認
        if(userData.email != email){
            const searchMail ={
                email:email
            }
            // メールアドレス変更チェック
            axios.post('http://localhost:8080/api/email/',searchMail)
            .then((response)=>{
                if(response.data == true){
                   setMailFlg(true) 
                }else{
                    send_update()
                }
                
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            send_update()
        }
        }
        
    }

    // データリセット
    function reset(){
        axios.get('http://localhost:8080/api/reset')
        .then((response)=>{
            console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    function send_update(){
        
            // newPassない場合今のpassを代入
            let post:userProp ={
                user_id:"",
                user_name:"",
                email:"",
                password:"",
                birthday:""
            }
            if(newPassFlg == false){
            post ={
                    user_id:userid,
                    user_name:newname,
                    email:email,
                    password:userData.password,
                    birthday:birthday
            }
            }else{
            post ={
                user_id:userid,
                user_name:newname,
                email:email,
                password:newPass,
                birthday:birthday
            }
            }
            // 送信
            axios.post('http://localhost:8080/api/user/update',post)
            .then((response)=>(
                setUserData(response.data)
            ))
            .catch((error)=>(
                console.log(error)
            ))
            setMode("user")
            setUserName(newname)

    }


    return(
        <div id="config_wrap" className="p-5">
            {mode == "user" &&
            // 設定TOP 及びユーザー情報確認
            
                <div>
                    <p className="text-2xl font-bold text-teal-950 mb-10" >設定</p>

                    {userData.user_name&&
                        <div>
                            <p className="text-xl font-bold">ユーザー名</p>
                            <p className="mb-2.5">{userData.user_name}</p>
                        </div>

                    }
                    {userData.email&&
                        <div>
                            <p className="text-xl font-bold">メールアドレス</p>
                            <p className="mb-2.5">{userData.email}</p>
                        </div>
                    }
                    {userData.birthday&&
                        <div>
                        <p className="text-xl font-bold">誕生日</p>
                        <p className="mb-5">{userData.birthday.replace(/(\d{4})-0?(\d{1,2})-0?(\d{1,2})/, '$1年$2月$3日')}</p>
                        </div>
                    }
                    {userData.user_id ==""&&
                        <div id="load_user" className="flex items-center justify-center mb-5">
                            <p className="text-gray-500 text-2xl">読み込み中・・・</p>
                        </div>
                    }
                    <div className="flex flex-row gap-5 justify-center">
                        <button onClick={update_set} className="bg-teal-900 text-white">設定変更</button>
                        <button onClick={()=>setMode("log")} className="bg-teal-900 text-white">過去のイベント</button>
                    </div>
                    <p className="text-teal-200 hidden" onClick={reset}>イベントデータリセット</p>

                </div>
            }
            {mode == "update"&&
            // ユーザー設定変更
                <div>
                    {/* ユーザー設定変更フォーム */}
                    <p className="text-2xl font-bold text-teal-950 underline-offset-1">設定変更</p>
                    <form action="" method="post" className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                        {checkPass==true && 
                            <p className="text-red-800 text-xs">パスワードが一致していません</p>
                        }
                        <input type="hidden" name="user_id" id="user_id" value={userid}/>
                        <label htmlFor="user_name">ユーザー名</label>
                        <input type="text" name="user_name" id="user_name" value={newname} onChange={(e)=>setNewName(e.target.value)} />
                        <label htmlFor="email">メールアドレス</label>
                        
                        {mailflg==true&&
                            <p className="alert">このメールアドレスは使用されています</p>
                        }
                        <input type="email" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                        <label htmlFor="bitrhday">誕生日</label>
                        <input type="date" name="bitrhday" id="birthday" value={birthday} onChange={(e)=>setBirthday(e.target.value)}/>

                        {newPassFlg== false ?(
                                <button type="button" onClick={switchNewPass} className=" border border-teal-900">パスワードを変更する</button>
                        ):(
                            <div className="flex flex-col gap-1 mb-5">
                                <label htmlFor="newpass">新しいパスワード</label>
                                <input type="password" name="newpass" id="newpass" value={newPass} onChange={(e)=>setNewPass(e.target.value)}/>
                                <button type="button" onClick={switchNewPass} className=" text-white border border-teal-900 bg-teal-900 ">パスワード変更をキャンセル</button>
                            </div>
                        )}



                        
                        <label htmlFor="password">現在のパスワード</label>
                        <input type="password" name="password" id="password" value={pass} onChange={(e)=>setPass(e.target.value)} />

                        <div className="flex flex-row gap-5">
                        <button type="button" onClick={()=>setMode("user")} className="border-2 border-teal-900">戻る</button>
                        <button className="bg-teal-900 text-white">更新</button>
                        </div>
                    </form>
                </div>
            }
            {mode == "log" &&
                <Log setMode={setMode} id={userid}/>
            }
            




        </div>
    )
}