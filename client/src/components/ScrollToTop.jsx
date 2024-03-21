import { useEffect } from "react";
import {  useLocation } from "react-router-dom";

const ScrollToTop = () => {
    // we get the patname from uselocation 
    const {pathname} = useLocation ();
    useEffect(() => {
        // scrolling to 0 to the top
        window.scrollTo(0,0);
        // when the pathname is changed we active this useffect
    },[pathname]);
    return null ;
}

export default ScrollToTop;