
import "./App.css";
import AppHeader from "./Components/AppHeader";
import PageContent from "./Components/PageContent";
import SideMenu from "./Components/SideMenu";
import { useSelector } from "react-redux";
import Portal from "./portal/Portal";

function App() {
  const isAuth = useSelector(state=> state.auth.isAuth)

  return (
   <>
   {isAuth? 
    <div className="App">
      <AppHeader />
      <div className="SideMenuAndPageContent">
        <SideMenu></SideMenu>
        <PageContent></PageContent>
      </div>
  
    </div>:
    <Portal/>

   }
    </> 
  );
}
export default App;
