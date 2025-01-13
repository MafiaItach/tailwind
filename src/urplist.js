// Global variable to store playlists
let playlists = {};

// Function to save playlists to local storage
function savePlaylists() {
  localStorage.setItem('playlists', JSON.stringify(playlists));
}

// Function to load playlists from local storage
function loadPlaylists() {
  const storedPlaylists = localStorage.getItem('playlists');
  if (storedPlaylists) {
    playlists = JSON.parse(storedPlaylists);
    displayAddedSongs();
  }
}

// Function to show the playlists modal
function showPlaylistsModal() {
  document.getElementById('playlistsModal').style.display = 'block';
  displayPlaylists();
}

// Function to close the playlists modal
function closePlaylistsModal() {
  document.getElementById('playlistsModal').style.display = 'none';
}

// Function to create a new playlist
function createPlaylist() {
  const playlistName = document.getElementById('newPlaylistName').value;
  if (playlistName) {
    if (!playlists[playlistName]) {
      playlists[playlistName] = [];
      displayPlaylists();
      document.getElementById('newPlaylistName').value = '';
      savePlaylists();
    } else {
      alert('Playlist already exists!');
    }
  }
}

// Function to display playlists in the modal
function displayPlaylists() {
  const playlistsContainer = document.getElementById('playlistsContainer');
  playlistsContainer.innerHTML = '';
  for (const playlistName in playlists) {
    const playlistElement = document.createElement('div');
    playlistElement.className = 'urplist';
    playlistElement.innerText = playlistName;
    playlistElement.onclick = function() {
      addToYourPlaylist(playlistName);
    };
    playlistsContainer.appendChild(playlistElement);
  }
}

// Function to add the current song to the selected playlist
function addToYourPlaylist(playlistName) {
  const currentVideoId = player.getVideoData().video_id;
  const currentVideoTitle = player.getVideoData().title;
  if (!playlists[playlistName].find(video => video.id === currentVideoId)) {
    playlists[playlistName].push({ id: currentVideoId, title: currentVideoTitle });
    savePlaylists();
  }
  closePlaylistsModal();
  displayAddedSongs();
}

// Function to display added songs as urplist thumbnails
function displayAddedSongs() {
  const playlistDiv = document.getElementById('urplist');
  playlistDiv.innerHTML = '';

  for (const playlistName in playlists) {
    if (playlists[playlistName].length > 0) {
      const playlistThumbnail = document.createElement('div');
      playlistThumbnail.className = 'playlist-thumbnail';
      
      
      // Create a grid container for the thumbnails
      const thumbnailGrid = document.createElement('div');
      thumbnailGrid.className = 'thumbnail-grid';
      
      // Add click listener to reveal songs list
      thumbnailGrid.addEventListener('click', function () {
        revealSongsList(playlistName);
      });
      // Add the first 4 song thumbnails
      playlists[playlistName].slice(0, 4).forEach(song => {
        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`;
        thumbnail.alt = song.title;
        thumbnailGrid.appendChild(thumbnail);
      });

      playlistThumbnail.appendChild(thumbnailGrid);

      // Add playlist name and shuffle button
      const playlistInfo = document.createElement('div');
      playlistInfo.className = 'uplistb';
      playlistInfo.innerHTML = `
        <h3>${playlistName}</h3>
        <button onclick="shufflePlaylist('${playlistName}')">
          <span class="material-symbols-outlined">shuffle</span>
        </button>
      `;
      playlistThumbnail.appendChild(playlistInfo);

      playlistDiv.appendChild(playlistThumbnail);
    }
  }
}

// Function to reveal songs list in a playlist with thumbnails
function revealSongsList(playlistName) {
  const playlistSongs = playlists[playlistName];
  const songsListDiv = document.createElement('div');
  songsListDiv.className = 'songs-list';

  // Hide the specified elements
  const elementsToHide = [
    document.querySelector('.mixedforyou'),   // Assuming 'mixedforyou' is the ID of the element
    document.querySelector('.home-songs'),
    document.querySelector('.backup-restore'),
    document.querySelector('.h1'),
    document.querySelector('.shuffle'),
    document.querySelector('.bookmarklink'),
    document.getElementById('playlist')
  ];

  elementsToHide.forEach(element => {
    if (element) {
      element.classList.add('hidden');
    }
  });

  playlistSongs.forEach(song => {
    const songElement = document.createElement('div');
    songElement.className = 'song';
    songElement.innerHTML = `
      <img src="https://img.youtube.com/vi/${song.id}/mqdefault.jpg" alt="${song.title}">
      <p>${song.title}</p>
    `;
    songElement.onclick = function() {
      playSong(song.id);
    };
    songsListDiv.appendChild(songElement);
  });

  const playlistDiv = document.getElementById('urplist');
  playlistDiv.innerHTML = '';
  const backButton = document.createElement('button');
  backButton.innerHTML = `<div class="cut"><button ><span class="material-symbols-outlined">keyboard_backspace</span></button><span>Back</span>`;

  // On Back Button Click
  backButton.onclick = function() {
    history.back(); // Go back in history
  };

  // Push a new state to the history
  history.pushState({ view: 'playlist' }, '', '#playlist');

  playlistDiv.appendChild(backButton);
  playlistDiv.appendChild(songsListDiv);
}

// Handle the Back Gesture using popstate
window.addEventListener('popstate', function(event) {
  // Check the state to decide what to show
  if (event.state && event.state.view === 'playlist') {
    // User navigated back to the playlist view
    // Keep current state logic here if needed
  } else {
    // Show the default view and reveal all elements
    const elementsToReveal = [
      document.querySelector('.mixedforyou'),   // Assuming 'mixedforyou' is the ID of the element
      document.querySelector('.home-songs'),
      document.querySelector('.backup-restore'),
      document.querySelector('.h1'),
      document.querySelector('.shuffle'),
      document.querySelector('.bookmarklink'),
      document.getElementById('playlist')
    ];

    elementsToReveal.forEach(element => {
      if (element) {
        element.classList.remove('hidden');
      }
    });

    displayAddedSongs();
  }
});



// Function to shuffle and play the playlist
function shufflePlaylist(playlistName) {
  repeatMode = 'no-repeat';
  const shuffledSongs = [...playlists[playlistName]].sort(() => Math.random() - 0.5);
  playSongsSequentially(shuffledSongs);
}

// Function to play songs sequentially
function playSongsSequentially(songs, index = 0) {
  if (index < songs.length) {
    playSong(songs[index].id);
    player.addEventListener('onStateChange', function onStateChange(event) {
      if (event.data === YT.PlayerState.ENDED) {
        player.removeEventListener('onStateChange', onStateChange);
        playSongsSequentially(songs, index + 1);
      }
    });
  }
}

// Load playlists when the page loads
window.onload = loadPlaylists;
