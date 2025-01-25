/* eslint-disable no-unused-vars */
import React, { useState , useEffect} from "react";
import { Routes, Route} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Content_Mp3 from './Components/Content/Content_Mp3'
import Content_Mp4 from './Components/Content/Content_Mp4'
import Dashboard from "./Components/Dashboard";
import Footer from "./Components/Footer";
import moon from "/src/assets/png/moon.png";
import sun from "/src/assets/png/sun.png";
import "./App.css";

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    // Set the initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes to the prefers-color-scheme media query
    mediaQuery.addListener(handleChange);

    // Cleanup listener on component unmount
    return () => mediaQuery.removeListener(handleChange);
  }, [])

  const [mode, setMode] = useState("dark");
  const [icon, setIcon] = useState(sun);

  const ToggleMode = () => {
    if (mode === "dark" && icon === sun) {
      setMode("light");
      setIcon(moon);

    } else {
      setMode("dark");
      setIcon(sun);
    }
  };

  return (
    <>
      <Navbar theme={theme} mode={mode} ToggleMode={ToggleMode} icon={icon} />
      <Routes>
        <Route path="/" element={<Dashboard mode={mode} />} />
        <Route path="/Mp3" element={<Content_Mp3 mode={mode} />} />
        <Route path="/Mp4" element={<Content_Mp4 mode={mode} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
