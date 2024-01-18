
let currentSong = new Audio();
let currentFolder;
let songs;


async function getSongs(folder = "mysongs") {
    let fetchedSongs = await fetch(`http://127.0.0.1:3000/songs/${folder}/`);
    currentFolder = `songs/${folder}`;
    let response = await fetchedSongs.text();

    let div = document.createElement('div')
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")

    songs = [];

    for (let j = 0; j < as.length; j++) {
        const element = as[j];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/${folder}/`)[1])
        }
    }

    let songlistUL = document.querySelector(".songlists").getElementsByTagName("ul")[0]
    songlistUL.innerHTML = ""

    for (const song of songs) {
        songlistUL.innerHTML = songlistUL.innerHTML +
            `<li class="flex list">
                            <img class="invert" src="musical-note.png" width="25px">

                                <div class="info">${song.replaceAll("%20", " ")}</div>
                                <img  src="play.png" width="25px">
                        </li>`;
    }


    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playSong(e.querySelector(".info").innerHTML)
            // console.log(e.querySelector(".info").innerHTML)
        })

    });



}




function secondsToMinutesSeconds(seconds) {

    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}



async function playSong(params, pause = false) {
    currentSong.src = `${currentFolder}/` + params
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songInfo").innerHTML = params
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00"

}






async function playcardMaker(Folder) {


    let fetchedalbums = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await fetchedalbums.text();
    let div = document.createElement('div')
    div.innerHTML = response;
    let playcards = document.querySelector(".playlists-container")
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            // console.log(folder);
            

            // get the metadata
            let fetchedinfo = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let responsejson = await fetchedinfo.json();
            // console.log(response);

            playcards.innerHTML = playcards.innerHTML + `<div data-folder="${folder}" class="playcards">
            <img src="songs/${folder}/cover.jpeg" width="150px">
            <h4>${responsejson.title}</h4>
            <h5>${responsejson.desc}</h5>
        </div>`
        }
    }

    Array.from(document.getElementsByClassName("playcards")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`${item.currentTarget.dataset.folder}`)

        })
    })


}



// __MAIN__

async function main() {

    playcardMaker()

    await getSongs();

    playSong(songs[0], true);



    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.png"
        }
    })


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent * (currentSong.duration)) / 100;

    })


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.translate = "0%";

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.translate = "-100%";
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`).slice(-1)[0])

        if ((index - 1) >= 0) {
            playSong(songs[index - 1]);
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`).slice(-1)[0])
        console.log(index);

        if ((index + 1) < songs.length) {
            playSong(songs[index + 1]);
        }
    })




    // Array.from(document.getElementsByClassName("playcards")).forEach(e => {
    //     e.addEventListener("click", async item => {
    //         await getSongs(`${item.currentTarget.dataset.folder}`)

    //     })
    // })










}

main()
