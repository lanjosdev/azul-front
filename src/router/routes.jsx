// Funcionalidades / Libs:
import { Routes, Route } from "react-router-dom";

// Pages:
import Login from "../pages/Login";

// Components:
// import ControllerRouter from "./ControllerRouter";



export default function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={ <Login /> } />

        </Routes>
    )
}