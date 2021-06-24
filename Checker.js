class Checker {
    constructor(type, x, y) {
        this.isActive = false;
        this.type = type;
        this.x = x;
        this.y = y;
        this.image = new Image();
        const WHITE = new Image();
        WHITE.src='img/white.png';
        const BLACK = new Image();
        BLACK.src='img/black.png';

        switch (this.type) {
            case 'black':
                this.image = BLACK;
                break;
            case 'white':
                this.image = WHITE;
                break;
        }
        // this.image.addEventListener('click',function (){
        //    console.log(this.x,this.y);
        // });
    }

    move(x,y){
        this.x = x;
        this.y = y;
        this.image = (this.type === "black") ? BLACK:WHITE;
        this.isActive = false;
        activeCh = null;
        queue = (queue === "white")? 'black' : 'white';
    }
}