---
layout: default
---

A Bitcoin Cash powered, Money Button inspired, frame for images or videos. Each frame has an address and a hourly rate that is used to determine if the image or video should be available. The same address can be used for multiple frames or in multiple websites with different rates.

Examples
--------

eatBCH_VE <br>
<img id="img_eatbch_ve" src="https://pbs.twimg.com/profile_images/1002336267411939328/SxeSLZvZ_400x400.jpg" width="200">

eatBCH_SS <br>
<img id="img_eatbch_ss" src="https://pbs.twimg.com/profile_images/1002291143617396736/FOnwtK_O_400x400.jpg" width="200">

Coins 4 Cothes <br>
<img id="img_c4clothes" src="https://pbs.twimg.com/profile_images/1021886596939833344/4qU5gwTy_400x400.jpg" width="200">

<script src="resources/javascript/moneyframe.bundle.js"></script>

<script>
  new MoneyFrame({ id: 'img_eatbch_ve', rate: 0.02, address: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g' });
  new MoneyFrame({ id: 'img_eatbch_ss', rate: 0.02, address: 'bitcoincash:qrsrvtc95gg8rrag7dge3jlnfs4j9pe0ugrmeml950' });
  new MoneyFrame({ id: 'img_c4clothes', rate: 0.02, address: 'bitcoincash:qzx4tqcldmvs4up9mewkf3ru0z6vy9wm6qm782fwla' });
</script>

``` html
<script src="resources/javascript/moneyframe.bundle.js"></script>

<script>
  new MoneyFrame({ id: 'img_eatbch_ve', rate: 0.02, address: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g' });
  new MoneyFrame({ id: 'img_eatbch_ss', rate: 0.02, address: 'bitcoincash:qrsrvtc95gg8rrag7dge3jlnfs4j9pe0ugrmeml950' });
  new MoneyFrame({ id: 'img_c4clothes', rate: 0.02, address: 'bitcoincash:qzx4tqcldmvs4up9mewkf3ru0z6vy9wm6qm782fwla' });
</script>
```
