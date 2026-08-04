const cloudImages = [

    "assets/cloud_1.png",
    "assets/cloud_2.png",
    "assets/cloud_3.png",
    "assets/cloud_4.png",
    "assets/cloud_5.png",
    "assets/cloud_6.png"

];


const cloudLayer =
document.getElementById("cloudLayer");


const clouds=[];



function random(min,max){

    return Math.random()*(max-min)+min;

}



function createCloud(){


    const cloud =
    document.createElement("div");


    cloud.className="cloud";


    cloudLayer.appendChild(cloud);



    const size=random(200,600);



    const data={

        element:cloud,

        x:random(
            -500,
            window.innerWidth
        ),

        y:random(
            50,
            window.innerHeight*.55
        ),

        speed:random(
            10,
            35
        )

    };



    cloud.style.width=
        size+"px";


    cloud.style.height=
        size*.45+"px";



    cloud.style.opacity=
        random(.35,.85);



    cloud.style.backgroundImage=

    `url(${cloudImages[
        Math.floor(
            Math.random()*cloudImages.length
        )
    ]})`;



    clouds.push(data);

}




// create clouds

for(let i=0;i<20;i++){

    createCloud();

}





let last =
performance.now();



function animate(time){


    const delta =
    (time-last)/1000;


    last=time;



    clouds.forEach(cloud=>{


        cloud.x +=
        cloud.speed*delta;



        if(cloud.x >
        window.innerWidth+300){


            cloud.x=-600;

            cloud.y=
            random(
                50,
                window.innerHeight*.55
            );


        }



        cloud.element.style.transform=

        `translate3d(
        ${cloud.x}px,
        ${cloud.y}px,
        0)`;



    });



    requestAnimationFrame(
        animate
    );


}



requestAnimationFrame(
    animate
);