export function setCookie(cookieName: string, value: any){
    document.cookie = `${cookieName}=${value};`;
}

export function getCookie(name:string): string | boolean | number | undefined{
    const cookies = document.cookie.split("; ");
    for(const cookie of cookies){
        const [key, value] = cookie.split("=");
        
        if(key === name){

            //boolean + int check
            if(value === "true" || value === "false"){
                return value === "true";
            }

            const numTemp: number = parseInt(value);
            if(!isNaN(numTemp) && numTemp.toString() === value){

                return numTemp;
            }
            
            //just a string
            return value;
        }
    }
    return undefined;
}

export function deleteCookie(name: string){setCookie(name, undefined);}