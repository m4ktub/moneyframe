Money Frame
===========

A Bitcoin Cash powered, Money Button inspired, frame for images or videos. Each frame has an address and a hourly rate that is used to determine if the image or video should be available. The same address can be used for multiple frames or in multiple websites with different rates.

Note that it's not intended to really protect the image or video but, instead, is intended to nudge people into keeping something readily available by contributing with a small amount.

Possible use cases include:

  * Monetizing digital assets in a blog,
  * Sponsoring artists in art galleries,
  * Subsidizing digital art collections with sponsors,
  * Paying for public outdoor information services,
  * etc.

Using
-----

The `moneyframe.bundle.js` can be imported directly as it includes all the dependencies. You can explore the examples to see it in use.

``` html
<script src="moneyframe.bundle.js"></script>

<script>
  // Should be at the bottom of the page.
  //
  // The `id` is for the element to cover, the `rate` is in BCH/hour for
  // ease of use, and the address is the address.
  new MoneyFrame({ id: '...', rate: 0.02, address: 'bitcoincash:...' });
</script>
```

How it works
------------

After the Money Frame is applied to an image it uses the REST services at Bitcoin.com to get all the payments made to that address. Depending on the rate you set, there may be enough payments to keep the image available. Otherwise, it will be covered with a QR Code and message.

For example, for an rate of 0.001 BCH/hour, if someone paid 0.01 two hours ago, the image will still be available for the next 8 hours (0.01 is enough for 10 hours of viewing). Any extra payment extends that availability.

Additionally, for now, the time only starts to count after transactions are confirmed. This means that any payment, no matter how small, will always display the image for 10 minutes, on average.

Building
--------

Runing `npm run build` will compile the sources and create

  * a javascript bundle directly under `dist` and
  * documentation in `dist/docs`.

Examples
--------

There are a couple of examples available in the `examples` directory which can be opened directly from the filesystem. The examples are ordered by complexity.
