let s1 = document.getElementById("svg1");
        let s2 = document.getElementById("svg2");
        let s3 = document.getElementById("svg3");
        let s4 = document.getElementById("svg4");
        let s5 = document.getElementById("svg5");
        function stopanim() {
            s1.style.animationPlayState = "paused";
            s2.style.animationPlayState = "paused";
            s3.style.animationPlayState = "paused";
            s4.style.animationPlayState = "paused";
            s5.style.animationPlayState = "paused";
            
        }
        function startanim() {
            s1.style.animationPlayState = "running";
            s2.style.animationPlayState = "running";
            s3.style.animationPlayState = "running";
            s4.style.animationPlayState = "running";
            s5.style.animationPlayState = "running";
        }