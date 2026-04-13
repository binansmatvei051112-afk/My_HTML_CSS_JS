<<<<<<< HEAD
window.onload = function () {

    const rick = document.getElementById('rick-pic');
    const bubble = document.getElementById('rick-bubble');

    rick.onclick = function () {


        if (bubble.style.display === "none") {
            bubble.style.display = "block";

            setTimeout(function () {
                bubble.style.display = "none";
            }, 3000)

        }
        
        else {
            bubble.style.display = "none";
        }
    };
=======
window.onload = function () {

    const rick = document.getElementById('rick-pic');
    const bubble = document.getElementById('rick-bubble');

    rick.onclick = function () {


        if (bubble.style.display === "none") {
            bubble.style.display = "block";

            setTimeout(function () {
                bubble.style.display = "none";
            }, 3000)

        }
        
        else {
            bubble.style.display = "none";
        }
    };
>>>>>>> 608d8218508c2f9c1c4ae38e9e097dcd13560c79
}