
function viewTab(event, sectionId) {
    // Get all toggle titles and remove the active class
    var toggleTitles = document.getElementsByClassName('toggle-title');
    for (var i = 0; i < toggleTitles.length; i++) {
        toggleTitles[i].classList.remove('active');
    }

    // Add the active class to the clicked toggle
    event.currentTarget.classList.add('active');

    // Hide all sections with class 'toggle-content'
    var contentSections = document.getElementsByClassName('toggle-content');
    for (var i = 0; i < contentSections.length; i++) {
        contentSections[i].classList.remove('active');
    }

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
}


//get youtube videos


function loadYoutubeVideos(button,container,loadingMore, searchQuery,searchBar){
    const API_KEY ='AIzaSyAHvf_FTd16GIh9n8ZQKtfgSgDz6sNljvk';
    const searchButton = document.getElementById(button);
    const videoContainer = document.getElementById(container);
    const loadMoreButton = document.getElementById(loadingMore);

    let nextPageToken = '';
    let currentQuery ='';
    // Function to search YouTube based on a query
    function searchYouTube(query, pageToken = '') {
        const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&maxResults=40&pageToken=${pageToken}`;  
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                displayVideos(data.items);
                nextPageToken =data.nextPageToken;
                if (nextPageToken) {
                    loadMoreButton.style.display = 'block';  // Show "Load More" button if there are more results
                } else {
                    loadMoreButton.style.display = 'none';  // Hide "Load More" button if no more results
                }   
            })
            .catch(error => {
                console.error('Error fetching YouTube videos:', error);
            });
    }

    // Function to display videos as iframes
    function displayVideos(videos) {

        videos.forEach(video => {
            const videoID = video.id.videoId;
            const videoIframe = `<iframe src="https://www.youtube.com/embed/${videoID}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            
            const videoDiv = document.createElement('div');
            videoDiv.innerHTML = videoIframe;
            videoContainer.appendChild(videoDiv);
        });
    }

    // Add event listener for search button
    searchButton.addEventListener('click', function() {
        const query = document.getElementById(searchBar).value;
        if (query) {
            videoContainer.innerHTML = ''; 
            currentQuery = query;
            searchYouTube(query);
        }
    });

    loadMoreButton.addEventListener('click', function() {
        if (nextPageToken) {
            searchYouTube(searchQuery, nextPageToken);  // Load more videos with the stored query and nextPageToken
        }
    });

    // When the page loads, display farming-related videos by default
    // window.onload = function() {
    //     searchYouTube(searchQuery);
    // };
    searchYouTube(searchQuery);
}

window.onload =function(){
    loadYoutubeVideos('search-button','video-container','load-more','Crop Planting, Care and Harvesting','search-bar')
}


document.getElementById('toggle2').addEventListener('click', function() {
    loadYoutubeVideos('searching-button','videos','load-More','Innovative &  Sustainable Farming Techniques','search-article-bar')
    // searchYouTube('Innovative &  Sustainable Farming Techniques');
});