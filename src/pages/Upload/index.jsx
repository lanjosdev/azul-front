// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect } from "react";

// API:

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { HeaderMenu } from "../../components/HeaderMenu/HeaderMenu";

// Assets:

// Estilo:
import './style.css';



export default function Upload() {



    const tokenCookie = Cookies.get('tokenEstoque');

    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Upload');
            
        } 
        initializePage();
    }, [tokenCookie]);

    



   
  
    return (
        <div className="Page Upload">

            <HeaderMenu />

            <main className='mainPage Upload grid'>
                <div className="main_top">
                    <h1>
                        {/* <i className="bi bi-upload"></i> */}
                        Upload de Vídeo
                    </h1>
                </div>

                
            </main>

        </div>
    );
}