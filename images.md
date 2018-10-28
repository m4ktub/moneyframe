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
    <img id="imga" src="resources/images/earth.jpg" width="290">
  </td>
  <td>
    <img id="imgb" src="resources/images/fire.jpg" width="290">
  </td>
</tr>
<tr>
  <td>
    <img id="imgc" src="resources/images/water.jpg" width="290">
  </td>
  <td>
    <img id="imgd" src="resources/images/wind.jpg" width="290">
  </td>
</tr>
</table>

<script>
  function setup(address) {
    let opts = { width: 290, height: 300, addres: address };
    let a = Object.extends({}, opts, { id: 'imga', rate: 0.01 });
    let b = Object.extends({}, opts, { id: 'imgb', rate: 0.02 });
    let c = Object.extends({}, opts, { id: 'imgc', rate: 0.05 });
    let d = Object.extends({}, opts, { id: 'imgd', rate: 0.10 });

    new MoneyFrame(a);
    new MoneyFrame(b);
    new MoneyFrame(c);
    new MoneyFrame(d);
  }
</script>

<script src="resources/javascript/moneyframe.bundle.js"></script>
