console.log('Let\'s write JavaScript!!');

async function getsongs() {
  try {
    let response = await fetch("http://127.0.0.1:5500/SpotifyClone/songs/");
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    let html = await response.text();
    console.log(html);

    // Create a temporary div element to parse the HTML
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Extract the content using DOM methods
    let as = tempDiv.getElementsByTagName("a");
    console.log(as);
     
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function main(){
    let songs = await getsongs();
    console.log(songs);
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("%20", " ")} </li?`;
    }





    //play the first audio
    let audio = new Audio(songs[0]);
    // Add an event listener to handle autoplay based on user interaction
    document.addEventListener("click", function() {
      if (audio.paused) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    });


    // by Harry code time duration


}

main();
