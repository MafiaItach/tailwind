function playNextVideo() {
    // Get the current video ID from the player
    const currentVideoId = player.getVideoData().video_id;
    console.log("Current Video ID:", currentVideoId);

    // Retrieve the playlists from localStorage
    const storedPlaylists = localStorage.getItem("playlists");
    if (!storedPlaylists) {
        console.error("No playlists found in localStorage.");
        return;
    }

    let playlists;
    try {
        playlists = JSON.parse(storedPlaylists);
    } catch (e) {
        console.error("Failed to parse playlists from localStorage:", e);
        return;
    }

    console.log("Playlists Loaded:", playlists);

    // Find the playlist that contains the current video
    let currentPlaylistKey = null;
    let currentPlaylist = null;
    let currentIndex = -1;

    for (const key in playlists) {
        const playlist = playlists[key];
        currentIndex = playlist.findIndex(item => item.id === currentVideoId);

        if (currentIndex !== -1) {
            currentPlaylistKey = key;
            currentPlaylist = playlist;
            break;
        }
    }

    if (!currentPlaylist || currentIndex === -1) {
        console.error("Current video not found in any playlist.");
        return;
    }

    console.log(`Current Playlist: ${currentPlaylistKey}`, currentPlaylist);
    console.log("Current Video Index:", currentIndex);

    // Determine the next index within the current playlist
    let nextIndex = currentIndex + 1;

    // If the end of the playlist is reached, loop back to the start
    if (nextIndex >= currentPlaylist.length) {
        console.log("Reached the end of the current playlist. Restarting from the beginning.");
        nextIndex = 0;
    }

    const nextVideo = currentPlaylist[nextIndex];
    console.log("Next Video:", nextVideo);

    // Play the next video
    if (nextVideo && nextVideo.id) {
        player.loadVideoById(nextVideo.id);
        player.playVideo();
        console.log(`Playing next video: ${nextVideo.title}`);
    } else {
        console.error("Next video is not available.");
    }
}
