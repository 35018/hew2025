import './App.css'
// modal
import Modal from 'react-modal';
Modal.setAppElement('#root')

import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import logo from './components/icon/clear_icon.svg'

// google Map API

export default function App() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [email_eror,setMailError] = useState(false);
  const [pass_error,setPassError] = useState(false);
  const [login_error,setLoginError] = useState(false);

  // 遷移
  const navigate = useNavigate();

  function handleSubmit(e){
        e.preventDefault();
        console.log("submits")
        const post = {
          email:email,
          password:password
        }

        setMailError(email.trim().length === 0)
        setPassError(password.trim().length ===0)
        console.log(email_eror,pass_error)
        if(email_eror == false && pass_error == false){
        axios.post('http://localhost:8080/api/login/',post)
            .then((response)=>{
              console.log(response)
              if(response.data == false){
                setLoginError(true)
              }else{
                setLoginError(false)
                // ログイン成功
                console.log(response.data.id,response.data.name)
                
                document.cookie= `user=${response.data.id}`;
                document.cookie= `name=${response.data.name}`
                navigate('/home')

              }
            }).catch((error)=>{
                console.log(error.message)
            })



        }else{
          setLoginError(false)
        }

  }
  // 簡易ログイン
  function TestLogin(){

        document.cookie= `user=1`;
        document.cookie= `name=ユーザー01`;
        navigate('/home')
  }


  return (
    <>
      <div id='wrap' className='bg-linear-180 from-teal-600 to-cyan-200 h-screen'>
      <title>とらべりん＿ログイン</title>
      <img src={logo} alt="とらべりん" width={200} height={200} className='m-auto p-5' onClick={TestLogin}/>

      <h1 className='mb-5 text-white'>ログイン</h1>
      {login_error && <p className="text-red-800 text-s">ユーザーが見つかりませんでした</p>}
      <form action="" className='flex flex-col items-center justify-center mb-5' onSubmit={handleSubmit}>
        <label htmlFor="email">メールアドレス</label>
        {email_eror && <p className="text-red-800 text-xs">入力してください</p>}
        <input type="text" name='email' id='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label htmlFor="password">パスワード</label>
        {pass_error && <p className="text-red-800 text-xs">入力してください</p>}
        <input type="password" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <div className='flex flex-col gap-2.5'>
          <button type="submit" className='bg-white text-xl border-2 border-teal-50/0  hover:border-teal-800'>ログイン</button>
          <a href="/new_user" className='text-l font-bold bg-white/80 p-2.5  rounded-xl  hover:inset-shadow-xs inset-shadow-teal-800'>ユーザー登録</a>
        </div>
      </form>


      </div>

    </>
  )
}


