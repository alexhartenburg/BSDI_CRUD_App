import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Posts from "./pages/Posts";
import PostViewer from "./components/PostViewer/PostViewer";
import { UserContext } from "./context/UserContext"

function App() {
  let cookie = document.cookie.split(";").find((element) => element.includes("crud_app_user"));
  let [user, setUser] = useState({})
  if(cookie && !user.id){
    let payloadData = JSON.parse(atob(cookie.split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
    setUser({
      id: payloadData.id,
      firstName: payloadData.first_name,
      lastName: payloadData.last_name,
      standard: payloadData.standard,
      command_staff: payloadData.commandStaff,
      administrator: payloadData.administrator,
    });
  }
  useEffect(() => {
    if (!document.cookie.includes("crud_app_user")) {
      setUser({});
    } else {
      cookie = document.cookie.split(";").find((element) => element.includes("crud_app_user"));
      let payloadData = JSON.parse(atob(cookie.split(".")[1]).replaceAll("[", "").replaceAll("]", ""));
      setUser({
        id: payloadData.id,
        firstName: payloadData.first_name,
        lastName: payloadData.last_name,
        standard: payloadData.standard,
        command_staff: payloadData.commandStaff,
        administrator: payloadData.administrator,
      });
    }
  }, [document.cookie]);
  if(cookie){
    return (
      <div className="App">
        <UserContext.Provider value={[user, setUser]}>
          <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Posts posts="user"/>} />
                <Route path="/allposts" element={<Posts posts="all"/>} />
                <Route path="/post/:id" element={<PostViewer />} />
                <Route path="/*" element={<Navigate replace to="/" />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </div>
    );
  }else{
    return (
      <div className="App">
        <UserContext.Provider value={[user, setUser]}>
          <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Posts posts="all"/>} />
                <Route path="/post/:id" element={<PostViewer />} />
                <Route path="/*" element={<Navigate replace to="/" />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </div>
    );
  }
}

export default App;
