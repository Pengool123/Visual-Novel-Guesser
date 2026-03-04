import { getCookie, setCookie } from "./cookie";

//makes the next part not look like super cancer
function setCSSVar(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
}

export default function cssSetup(){
    if(getCookie("skin") !== undefined){
        let skinValue: string = (getCookie("skin") as string).toString();
    switch(skinValue){
        case "0":
            setCSSVar("--text-col", "rgb(255, 255, 255)");
            setCSSVar("--miSpoil-txt-col", "rgb(253, 255, 139)");
            setCSSVar("--maSpoil-txt-col", "rgb(255, 0, 0)");
            setCSSVar("--bg-col", "rgb(0, 0, 0)");
            setCSSVar("--outline", "rgb(149, 0, 0)");
            setCSSVar("--transp-bg", "rgba(176, 176, 176, 0.5)");
            setCSSVar("--alt-transp-bg", "rgba(133, 133, 133, 0.5)");
            setCSSVar("--intractable-bg", "rgb(50, 50, 50)");
            setCSSVar("--bg-img", "url('/assets/kagari.png')");
            setCSSVar("--bg-img-pos", "bottom right");
            break; 
        case "1":
            setCSSVar("--text-col", "rgb(255, 255, 255)");
            setCSSVar("--miSpoil-txt-col", "rgb(253, 255, 139)");
            setCSSVar("--maSpoil-txt-col", "rgb(255, 0, 0)");
            setCSSVar("--bg-col", "rgb(0, 0, 0)");
            setCSSVar("--outline", "rgb(3, 82, 140)");
            setCSSVar("--transp-bg", "rgba(3, 30, 97, 0.4)");
            setCSSVar("--alt-transp-bg", "rgba(3, 28, 89, 0.5)");
            setCSSVar("--intractable-bg", "rgb(4, 40, 112)");
            setCSSVar("--bg-img", "url('/assets/angel-bg.jpg')");
            setCSSVar("--bg-img-pos", "top left");
            break;
        default:
            setCSSVar("--text-col", "rgb(255, 255, 255)");
            setCSSVar("--miSpoil-txt-col", "rgb(253, 255, 139)");
            setCSSVar("--maSpoil-txt-col", "rgb(255, 0, 0)");
            setCSSVar("--bg-col", "rgb(0, 0, 0)");
            setCSSVar("--outline", "rgb(149, 0, 0)");
            setCSSVar("--transp-bg", "rgba(176, 176, 176, 0.5)");
            setCSSVar("--alt-transp-bg", "rgba(133, 133, 133, 0.5)");
            setCSSVar("--intractable-bg", "rgb(50, 50, 50)");
            setCSSVar("--bg-img", "url('/assets/kagari.png')");
            setCSSVar("--bg-img-pos", "bottom right");
            break;
        }
    }else{
        setCookie("skin",0);
        setCSSVar("--text-col", "rgb(255, 255, 255)");
        setCSSVar("--miSpoil-txt-col", "rgb(253, 255, 139)");
        setCSSVar("--maSpoil-txt-col", "rgb(255, 0, 0)");
        setCSSVar("--bg-col", "rgb(0, 0, 0)");
        setCSSVar("--outline", "rgb(149, 0, 0)");
        setCSSVar("--transp-bg", "rgba(176, 176, 176, 0.5)");
        setCSSVar("--alt-transp-bg", "rgba(133, 133, 133, 0.5)");
        setCSSVar("--intractable-bg", "rgb(50, 50, 50)");
        setCSSVar("--bg-img", "url('/src/assets/kagari.png')");
        setCSSVar("--bg-img-pos", "bottom right");
    }
    
}