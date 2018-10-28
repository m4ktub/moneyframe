---
layout: default
---

# Images

Choose an address. You can use your own address to test. When ready, press the button and the frame will be applied to all images bellow.

Each image has a different rate. Try donating 10 cents. If Bitcoin Cash is worth $500 then the top left image will show for about 1 minute and the bottom right for about 7 seconds.

{% include fields.html id="fields" fn="setup" rate="off" address="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g" %}

<table>
<tr>
  <td>
    <img id="imga" src="resources/images/earth.jpg" width="300"></img>
  </td>
  <td>
    <img id="imgb" src="resources/images/fire.jpg" width="300"></img>
  </td>
</tr>
<tr>
  <td>
    <img id="imgc" src="resources/images/water.jpg" width="300"></img>
  </td>
  <td>
    <img id="imgd" src="resources/images/wind.jpg" width="300"></img>
  </td>
</tr>
</table>

<script>
  function setup(address) {
    new MoneyFrame({ id: 'imga', rate: 0.01, address: address });
    new MoneyFrame({ id: 'imgb', rate: 0.02, address: address });
    new MoneyFrame({ id: 'imgc', rate: 0.05, address: address });
    new MoneyFrame({ id: 'imgd', rate: 0.10, address: address });
  }
</script>

<script src="resources/javascript/moneyframe.bundle.js"></script>
