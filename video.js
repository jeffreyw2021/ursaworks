var players = {};

function onYouTubeIframeAPIReady() {
  var upcomingEvents = document.querySelectorAll('.upcoming-event');
  
  upcomingEvents.forEach(function(eventElem, index) {
    var videoId = 'video' + (index + 1);
    var videoURL = document.getElementById(videoId).src.split('?')[0]; // Remove URL parameters
    
    players[videoId] = new YT.Player(videoId, {
      events: {
        'onReady': function(event) {
          onPlayerReady(event, videoId);
        },
        'onStateChange': function(event) {
          onPlayerStateChange(event, videoId);
        }
      }
    });
    eventElem.addEventListener('click', function() {
        window.open(videoURL, '_blank'); // Open the video URL in a new tab
      });
    eventElem.addEventListener('mouseover', function() {
      players[videoId].playVideo();
    });

    eventElem.addEventListener('mouseout', function() {
      players[videoId].pauseVideo();
    });
  });
}

function onPlayerReady(event, videoId) {
  event.target.mute();  // Mute the video
  event.target.playVideo();  // Autoplay the video

  setTimeout(function() {
    event.target.pauseVideo();
  }, 1);
}

function onPlayerStateChange(event, videoId) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.playVideo();  // Restart video automatically when it ends
  }
}
