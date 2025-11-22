interface ImageConfig{
    imgUrl?: string;
    imgS?: number;
    imgV?: number;
}

export default class Img{
    public imgUrl: string = '';
    public imgS: number = 0;
    public imgV: number = 0;

    constructor({imgUrl='', imgS = 0, imgV = 0}:ImageConfig){
        this.imgUrl = imgUrl;
        this.imgS = imgS;
        this.imgV = imgV;
    }
}