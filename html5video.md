---
layout: default
---

# HTML5 Video

Choose an address and the rate, with the slider. You can use your own address to test. When ready, press the button and the frame will be applied to the video bellow. When a payment is made the video will start automatically.

{% include fields.html id="fields" fn="setup" address="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g" %}

<div style="width: 640px; height: 360px; position: relative;">
  <video id="htmlvideo"
         controls
         loop
         src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v"
         width="640"
         height="360">

      Sorry, your browser doesn't support embedded videos.
  </video>
  <div id="countdown"
       style="position: absolute; display: none; bottom: 40px; right: 10px; padding: 4px; background-color: white;"></div>
</div>

<script>
  function setup(address, rate) {
    let video = document.getElementById('htmlvideo');
    let countdown = document.getElementById('countdown');

    let frame = new MoneyFrame({ id: 'htmlvideo', rate: rate, address: address });

    frame.paidEvent.register(function() {
      video.play();
    });

    frame.unpaidEvent.register(function() {
      video.pause();
      countdown.style.display = 'none';
    });

    frame.countdownEvent.register(function(status) {
      let seconds = Math.floor((status.paidUntil - Date.now()) / 1000);

      countdown.style.display = 'block';
      countdown.innerHTML = seconds + " seconds remaining";
    });
  }
</script>

<script src="resources/javascript/moneyframe.bundle.js"></script>
