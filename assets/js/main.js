$(document).ready(function(){

    //this is pertaining to the modal on the splash page <plz do not delete my dudes>

    $(window).on('load',function(){
        $('#myModal').modal('show');
    });

    //this plays my song--- or should
    var song = document.createElement('audio');
    song.setAttribute("src", ".//audio/travel-song");
    song.play();


    
});