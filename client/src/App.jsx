import React, { useState, useEffect } from "react";
import { Route,Routes } from 'react-router-dom'
import Loader from "./components/Loader";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (<>
  <Routes>
    <Route path="/" element={loading ? <Loader /> : <Landing />}/>
    <Route path="/signup" element={<SignUp/>}/>
  </Routes>
  </>);
};

export default App;
