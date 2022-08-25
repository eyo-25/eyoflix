import { useEffect, useState } from "react";

export function makeImagePath(id:string, format?:string){
    return id === null ? (
      `https://netflix-gw.netlify.app/static/media/noPoster.8a5ba7e5.png`) : (
      `https://image.tmdb.org/t/p/${format? format:"original"}/${id}`)
}

function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }
  export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowDimensions;
}