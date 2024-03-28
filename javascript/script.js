console.log("Let's write JavaScript!!");
let currentSong = new Audio();
let songs

 // for conerte second to minutes
 function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}




async function getsongs() {
  try {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    if (!response.ok) {
      throw new Error("Network response was not ok.");
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

      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split("/songs/")[1]);
      }
    }
    return songs;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const playMusic = (track, pause= false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track;
  
  if(!pause){
    currentSong.play();
    play.src = "/svg/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00"
};

async function main() {
  // Get the list of all the songs 
  songs = await getsongs();
  console.log(songs);
  playMusic(songs[0],true)

  //Show all songs in the pllaylist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
        <img class="invert" src="svg/music.svg" alt="">
        <div class="sinfo">
            <div> ${song.replaceAll("%20", " ")} </div>
            <div>Lakshya </div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class="invert" src="svg/play.svg" alt="">
        </div>       
       </li>`;
  }

  // Attach an event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".sinfo").firstElementChild.innerHTML);
      playMusic(e.querySelector(".sinfo").firstElementChild.innerHTML.trim());
    });
  });


  // Attach an event listner to play , next and previous
   play.addEventListener("click",()=>{
       if(currentSong.paused){
        currentSong.play();
        play.src = "/svg/pause.svg"
       }
       else{
        currentSong.pause();
        play.src = "/svg/play.svg"
       }
   })

   // Listen for timeupdate event
   currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});
  

// add event listener for seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
  let seekBarPerct = (e.offsetX/e.target.getBoundingClientRect().width) *100 
 document.querySelector(".circle").style.left = seekBarPerct + "%";
 currentSong.currentTime = ((currentSong.duration) *seekBarPerct) /100;
})
}

//Add event listner for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
  // document.querySelector(".left").style.height = "400px"
  document.querySelector(".left").style.left = "0"
  // document.querySelector(".footer").style.display = "none"


} );

// Add event listerner for close 
document.querySelector(".closeSVG").addEventListener("click", ()=>{
  document.querySelector(".left").style.left = "-120%"

} );

//Add event listner for prev
previous.addEventListener("click",()=>{
  console.log("this this prev");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
  console.log(index)
  if((index-1) >=0){
    playMusic(songs[index-1])

  }

})

//Add event listner for next
next.addEventListener("click",()=>{
  console.log("this this next");

  let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
  console.log(index)
  if((index+1) <songs.length){
    playMusic(songs[index+1])

  }
})


main();
