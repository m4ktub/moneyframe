---
layout: default
title: Start
---

Choose an address and the rate, with the slider. You can use your own address to test. When ready, press the button and the frame will be applied to the video bellow. When a payment is made the video will start automatically.

{% include fields.html id="fields" fn="setup" address="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g" %}

<div style="width: 640px; height: 360px; position: relative;">
  <div id="video"></div>
  <div id="countdown"
       style="position: absolute; display: none; bottom: 40px; right: 10px; padding: 4px; background-color: white;"></div>
</div>

<script>
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
      height: '360',
      width: '640',
      videoId: 'OE3QTbgh-p8'
    });
  }

  function setup(address, rate) {
    let frame = new MoneyFrame({
      id: 'video',
      rate: rate,
      address: address
    });

    frame.paidEvent.register(function() {
      player.playVideo();
    });

    frame.unpaidEvent.register(function() {
      player.pauseVideo();
      countdown.style.display = 'none';
    });

    frame.countdownEvent.register(function(status) {
      let seconds = Math.floor((status.paidUntil - Date.now()) / 1000);
      countdown.style.display = 'block';
      countdown.innerHTML = seconds + " seconds remaining";
    });
  }
</script>

### Other Examples

<style type="text/css">
  .samples {
    height: 180px;
  }

  .square {
    padding: 4px;
    float: left;
    width: 160px;
    height: 160px;
    position: relative;
  }

  .square a {
    text-align: center;
    text-decoration: none;
    display: inline-block;
    height: 100%;
    width: 100%;
  }

  .square a span {
    color: white;
    background-color: rgba(0, 0, 0, 0.8);
    display: inline-block;
    padding: 4px 0px;
    width: 100%;
    position: relative;
    z-index: 1;
  }

  .square img {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 160px;
  }
</style>

<div class="samples">
  <div class="square">
    <a href="images.html">
      <span>Images</span>
      <img src="resources/images/images.png"></img>
    </a>
  </div>

  <div class="square">
    <a href="html5video.html">
      <span>HTML5 video</span>
      <img src="resources/images/html5video.png"></img>
    </a>
  </div>
</div>

<script src="resources/javascript/moneyframe.bundle.js"></script>
