function setUpEvents() {
	function _(query) {
		return document.querySelector(query);
	}
	function _all(query) {
		return document.querySelectorAll(query);
	}

	let songList = [
		{
			thumbnail: "gold_shadow.jpg",
			audio: "Ever Could.mp3",
			songname: "Ever Could",
			artistname: "Willliam Fitzsimmons",
		},
		{
			thumbnail: "last_request.jpg",
			audio: "Last Request.mp3",
			songname: "Last Request",
			artistname: "Paolo Nutini",
		},
		{
			thumbnail: "let_it_go.jpg",
			audio: "Let It Go.mp3",
			songname: "Let It Go",
			artistname: "James Bay",
		},
		{
			thumbnail: "secrets.jpg",
			audio: "Secret.mp3",
			songname: "Secret",
			artistname: "Maroon 5",
		},
		{
			thumbnail: "waiting_love.jpg",
			audio: "Waiting For Love.mp3",
			songname: "Waiting For Love",
			artistname: "Avicii",
		},
	];

	let currentSongIndex = 0;

	let player = _(".player"),
		toggleSongList = _(".player .toggle-list");

	let main = {
		audio: _(".player .main audio"),
		thumbnail: _(".player .main img"),
		icon: _(".player .main i"),
		seekbar: _(".player .main input"),
		songname: _(".player .main .details h2"),
		artistname: _(".player .main .details p"),
		prevcontrol: _(".player .main .controls .prev-control"),
		playpausecontrol: _(".player .main .controls .play-pause-control"),
		nextcontrol: _(".player .main .controls .next-control"),
	};

	toggleSongList.addEventListener("click", () => {
		player.classList.toggle("activeSongList");
		toggleSongList.classList.toggle("active");
	});

	_(".player .player-list .list").innerHTML = songList
		.map((song, songIndex) => {
			return `
			<div class="item" songIndex="${songIndex}">
				<div class="thumbnail">
					<img src="./files/${song.thumbnail}">
				</div>
				<div class="details">
					<h2>${song.songname}</h2>
					<p>${song.artistname}</p>
				</div>
			</div>
		`;
		})
		.join("");

	let songListItems = _all(".player .player-list .list .item");
	songListItems.forEach((songitem) => {
		songitem.addEventListener("click", () => {
			songListItems.forEach((listItem) => {
				listItem.classList.remove("active");
			});

			currentSongIndex = songitem.getAttribute("songIndex");
			loadSong(currentSongIndex);
			player.classList.remove("activeSongList");
			songitem.classList.add("active");
		});
	});

	function loadSong(songIndex) {
		let song = songList[songIndex];
		main.thumbnail.setAttribute("src", "./files/" + song.thumbnail);
		main.thumbnail.classList.add("active");
		main.icon.classList.add("active");
		main.songname.innerText = song.songname;
		main.artistname.innerText = song.artistname;
		main.audio.setAttribute("src", "./files/" + song.audio);
		main.seekbar.setAttribute("value", 0);
		main.seekbar.setAttribute("min", 0);
		main.seekbar.setAttribute("max", 0);
		main.audio.addEventListener("canplay", function () {
			main.audio.play();
			if (!main.audio.paused) {
				main.playpausecontrol.classList.remove("paused");
			}
			main.seekbar.setAttribute("max", parseInt(main.audio.duration));
			main.audio.onended = function () {
				main.nextcontrol.click();
			};
		});
	}

	setInterval(() => {
		main.seekbar.value = parseInt(main.audio.currentTime);

		
	}, 1000);

	main.prevcontrol.addEventListener("click", () => {
		currentSongIndex--;
		if (currentSongIndex < 0) {
			currentSongIndex = songList.length + currentSongIndex;
		}
		loadSong(currentSongIndex);
		removeHighlight();
	});

	main.nextcontrol.addEventListener("click", () => {
		currentSongIndex = (currentSongIndex + 1) % songList.length;
		loadSong(currentSongIndex);
		removeHighlight();
	});

	main.playpausecontrol.addEventListener("click", () => {
		if (main.audio.paused) {
			main.playpausecontrol.classList.remove("paused");
			main.audio.play();
		} else {
			main.playpausecontrol.classList.add("paused");
			main.audio.pause();
		}
	});

	main.seekbar.addEventListener("change", () => {
		main.audio.currentTime = main.seekbar.value;
		currentTime = main.seekbar.value;
	});

	function removeHighlight() {
		songListItems.forEach((item) => {
			item.classList.remove("active");
		});
	}

	main.audio.addEventListener("timeupdate", () => {

		let audioCurrentTime = main.audio.currentTime;

		let minutes = "0" + Math.floor(audioCurrentTime / 60);
		let seconds = "0" + (Math.floor(audioCurrentTime) - minutes * 60);
		let dur = minutes.substr(-2) + ":" + seconds.substr(-2);

		document.querySelector(".current-time").innerHTML = dur;

		let durmins = Math.floor(main.audio.duration / 60);
		let dursecs = Math.floor(main.audio.duration - durmins * 60);

		if (dursecs < 10) {
			durmins = `0${dursecs}`;
		}
		if (durmins < 10) {
			durmins = `0${durmins}`;
		}

		document.querySelector(".full-time").innerHTML = durmins + ":" + dursecs;
	});

	loadSong(currentSongIndex);
}

window.onload = function () {
	setUpEvents();
};
