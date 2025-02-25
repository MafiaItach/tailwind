// Define the trending playlist IDPL4fGSI1pDJn77aK7sAW2AT0oOzo5inWY8

// Function to load trending songs from the playlist

function loadTrendingSongs() {
  var trendingSongLists = document.querySelectorAll(
    ".trending-song-list.column"
  );
  var trendingPlaylistId = getRendomPlaylist2();
  var apiKey = getRandomAPIKey();
  // Fetch the playlist items using the YouTube Data API
  var playlistItemsUrl =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=30&playlistId=" +
    trendingPlaylistId +
    "&key=" +
    apiKey;

  $.getJSON(playlistItemsUrl, function (response) {
    var items = response.items;

    items.forEach(function (item, index) {
      var video = item.snippet;
      var videoId = video.resourceId.videoId;
      var videoTitle = video.title;
      var truncatedTitle = truncateTitle(videoTitle);
      var videoThumbnailUrl = video.thumbnails.medium.url;

      // Determine the column for each song
      var column = trendingSongLists[index % 3];

      // Create a list item for each trending song with the video thumbnail
      var listItem = document.createElement("li");
      listItem.innerHTML = `
               <img src="${videoThumbnailUrl}" alt="${videoTitle} Thumbnail">
               <div class="song-title">${truncatedTitle}</div>
           `;

      // Add a click event listener to play the video
      listItem.addEventListener("click", function () {
        playVideo(videoId);
      });

      column.appendChild(listItem);
    });
  });
}


async function fetchNewReleases() {
  try {
    const apiKey = getRandomAPIKey();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=5&videoCategoryId=10&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch new releases");
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching new releases:", error);
    return [];
  }
}
// Call the function to load trending songs
loadTrendingSongs();
