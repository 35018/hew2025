import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser(){
    const [name,setName]= useState('')
    const [email,setEmail] = useState('')
    const [pass,setPass] = useState('')
    const [subPass,setSubPass] = useState('')
    const [birthday,setBirthday] = useState('')

    const [mailflg,setMailFlg] = useState(false)
    const [passflg,setPassFlg]= useState(false)

    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();


        if(pass == subPass){
            setPassFlg(false)
            const searchMail ={
                email:email
            }

            axios.post('http://localhost:8080/api/email/',searchMail)
            .then((response)=>{
                console.log(response.data)
                if(response.data==true){
                    setMailFlg(true)
                }else{
                    const post ={
                            user_name:name,
                            email:email,
                            password:pass,
                            birthday:birthday
                    }
                    console.log(post)
                    axios.post('http://localhost:8080/api/users',post)
                    .then(()=>(
                        // 登録成功時ログイン画面に戻る
                        navigate('/')
                    ))
                    .catch((error)=>(
                        console.log(error)
                    ))

                    setMailFlg(false)
                }
            }).catch((error)=>{
                console.log(error.message)
            })
                        

        }else{
            setPassFlg(true)
        }
    }
    return(
        <div id="wrap" className="bg-teal-300 h-screen flex justify-center items-center">
            <form action="" className=" flex flex-col justify-center items-center rounded-2xl bg-white px-20 py-10" onSubmit={handleSubmit}>
                <p className="text-teal-950 font-bold mb-5">とらべりん ユーザー登録</p>
                <label htmlFor="name">名前</label>
                <input type="text" name="name" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>

                <label htmlFor="email">メールアドレス</label>
                <input type="email" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                {mailflg==true&&
                    <p className="alert">このメールアドレスは使用されています</p>
                }

                <label htmlFor="pass">パスワード</label>
                <input type="password" name="pass" id="pass" value={pass} onChange={(e)=>setPass(e.target.value)}/>
                <label htmlFor="subPass">パスワード(再入力)</label>
                <input type="password" name="sub" id="sub" value={subPass} onChange={(e)=>setSubPass(e.target.value)}/>
                {passflg== true &&
                    <p className="text-red-800 text-xs">パスワードが一致していません</p>
                }

                <label htmlFor="birthday">誕生日</label>
                <input type="date" name="birthday" id="birthday" value={birthday} onChange={(e)=>setBirthday(e.target.value)}/>

                 <button className="border-0 bg-teal-800 font-bold text-white">登録</button>
            </form>

        </div>
    )
}