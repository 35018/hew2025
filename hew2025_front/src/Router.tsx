import { BrowserRouter,Routes,Route } from "react-router-dom"

// 
import App from "./App";
// 実機能部分_カレンダー
import Home from "./pages/home/home";
import Admin from "./pages/admin";
import CreateUser from "./components/forms/createUser";


export default function WARouter(){
    return(
        <BrowserRouter>
        <Routes>
            
            <Route path={`/`} element={<App/>} />
            <Route path={`/new_user`} element={<CreateUser/>}/>
            <Route path={`/home`} element={<Home/>} />
            <Route path={`/admin`} element={<Admin/>}/>
            <Route path={`*`} element={<p>not found</p>} />
            
            

        </Routes>
        </BrowserRouter>
    );
}
