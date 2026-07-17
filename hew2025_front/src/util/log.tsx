// ログのトップ
import { useState } from "react";
import LogList from "./log_list";
import LogDetail from "./log_detail";

type logProps = {
    setMode:React.Dispatch<React.SetStateAction<string>>
    id:string
}

export default function Log({setMode,id}:logProps){
    const [logId,setLogId] = useState<number>(0)
    return(
        <div id="logWrap" className="flex flex-col gap-5 justify-start items-start w-5/6">
            <button className="left-5 border-2 border-teal-800 p-2" onClick={()=>setMode("user")}>設定トップへ戻る</button>

            {logId === 0?(
                <LogList setMode={setMode} setLogId={setLogId} id={id}/>
            ):(
                <LogDetail logId={logId} setLogId={setLogId} id={id}/>
            )}
        </div>
    )
}