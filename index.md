---
layout: default
---

A Bitcoin Cash powered, Money Button inspired, frame for images or videos. Each frame has an address and a hourly rate that is used to determine if the image or video should be available. The same address can be used for multiple frames or in multiple websites with different rates.

Video
-----

Choose an address, the viewing rate, and click "Go". You can use one of your own addresses.

<div id="fields">
  <div>
    <label style="display: inline-block; width: 60px;" for="address">Address</label>
    <input id="address" type="text" size="50"
           placeholder="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g"
           value="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g">
    <button id="button" type="button"
            onclick="setupVideo();">Go</button>
  </div>
  <div>
    <label style="display: inline-block; width: 60px;" for="rate">Rate</label>
    <input id="rate" type="range" style="width: 270px;"
           max="1.0" min="0.00000001" step="0.00000001" value="0.01"
           oninput="document.getElementById('lrate').innerHTML = parseFloat(this.value).toFixed(8);">
    <span id="lrate">0.00000001</span> BCH/hour
  </div>
  <br/>
</div>
<div style="width: 640px; height: 360px; position: relative;">
  <video id="htmlvideo"
         controls
         src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v"
         width="640"
         height="360">

      Sorry, your browser doesn't support embedded videos.
  </video>
  <div id="countdown"
       style="position: absolute; display: none; bottom: 40px; right: 10px; padding: 4px; background-color: white;"></div>
</div>

<script>
  function setupVideo() {
    let fieldsEl = document.getElementById('fields');
    let addressEl = document.getElementById('address');
    let rateEl = document.getElementById('rate');

    let video = document.getElementById('htmlvideo');
    let countdown = document.getElementById('countdown');

    fieldsEl.style.display = "none";

    let address = addressEl.value;
    let rate = parseFloat(rateEl.value);

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

Images
------

Try donating 20 cents to any of the addresses. If Bitcoin Cash is worth $500 then the image will show for about 1 minute.

| eatBCH_VE     | eatBCH_SS     | Coins4Clothes |
|:-------------:|:-------------:|:-------------:|
| 0.02 BCH/hour | 0.02 BCH/hour | 0.02 BCH/hour |
| <img id="img_eatbch_ve" src="https://pbs.twimg.com/profile_images/1002336267411939328/SxeSLZvZ_400x400.jpg" width="150"> | <img id="img_eatbch_ss" src="https://pbs.twimg.com/profile_images/1002291143617396736/FOnwtK_O_400x400.jpg" width="150"> | <img id="img_c4clothes" src="https://pbs.twimg.com/profile_images/1021886596939833344/4qU5gwTy_400x400.jpg" width="150"> |

<script src="resources/javascript/moneyframe.bundle.js"></script>

<script>
  new MoneyFrame({ width: 160, height: 230,
    id: 'img_eatbch_ve',
    rate: 0.02,
    address: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
  });
  new MoneyFrame({ width: 160, height: 230,
    id: 'img_eatbch_ss',
    rate: 0.02,
    address: 'bitcoincash:qrsrvtc95gg8rrag7dge3jlnfs4j9pe0ugrmeml950'
  });
  new MoneyFrame({ width: 160, height: 230,
    id: 'img_c4clothes',
    rate: 0.02,
    address: 'bitcoincash:qzx4tqcldmvs4up9mewkf3ru0z6vy9wm6qm782fwla'
  });
</script>
