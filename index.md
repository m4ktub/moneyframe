---
layout: default
---

A Bitcoin Cash powered, Money Button inspired, frame for images or videos. Each frame has an address and a hourly rate that is used to determine if the image or video should be available. The same address can be used for multiple frames or in multiple websites with different rates.

Video
-----

<form id="form">
    <fieldset>
      <legend>Choose address and rate for video</legend>

      <div>
        <label for="address">Address</label>
        <input id="address" type="text" size="50"
               placeholder="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g"
               value="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g">
      </div>

      <div>
        <label for="rate">Rate</label>
        <input id="rate" type="range"
               max="1.0" min="0.00000001" step="0.00000001" value="0.00000001"
               oninput="document.getElementById('lrate').innerHTML = parseFloat(this.value).toFixed(8);">
        <span id="lrate">0.00000001</span> BCH/hour
      </div>

      <button id="button" type="button"
              onclick="setup();">Go</button>
    </fieldset>
  </form>

  <div style="width: 640px; height: 360px; position: relative;">
    <video id="video"
           src="https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_640x360.m4v"
           width="640"
           height="360">

        Sorry, your browser doesn't support embedded videos.
    </video>
    <div id="countdown"
         style="position: absolute; display: none; bottom: 40px; right: 10px; padding: 4px; background-color: white;"></div>
  </div>

  <script>
    function setup() {
      let formEl = document.getElementById('form');
      let addressEl = document.getElementById('address');
      let rateEl = document.getElementById('rate');

      formEl.style.display = "none";

      let address = addressEl.value;
      let rate = parseFloat(rateEl.value);

      window.mf1 = new MoneyFrame({ id: 'video', rate: rate, address: address });
      window.mf1.paidEvent.register(function() {
        let video = document.getElementById('video')
        video.play();
      });
      window.mf1.unpaidEvent.register(function() {
        let video = document.getElementById('video')
        video.pause();
        let countdown = document.getElementById('countdown');
        countdown.style.display = 'none';
      });
      window.mf1.countdownEvent.register(function(status) {
        let seconds = Math.floor((status.paidUntil - Date.now()) / 1000);

        let countdown = document.getElementById('countdown');
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

``` html
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
```
