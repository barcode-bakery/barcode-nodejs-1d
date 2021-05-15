<p align="center"><a href="https://www.barcodebakery.com" target="_blank">
    <img src="https://www.barcodebakery.com/images/BCG-Logo-SQ-GitHub.svg">
</a></p>

[Barcode Bakery][1] is library written in Node.JS, [.NET Standard][32] and [PHP][33] which allows you to generate barcodes on the fly on your server for displaying or saving.

The library has minimal dependencies in each language in order to be supported on a wide variety of web servers.

The library is available for free for non-commercial use; however you must [purchase a license][2] if you plan to use it in a commercial environment.

Installation
------------
There are two ways to install our library:

* With composer, run the following command:
```bash
$ npm install barcode-bakery-1d
```
* Or, download the library on our [website][3], and follow our [developer's guide][4].

Requirements
------------
* [node-canvas](https://github.com/Automattic/node-canvas). Version 2+
* node >= 14+

Example usages
--------------
For a full example of how to use each symbology type, visit our [API page][5].

### Displaying a Code 128 on the screen
```javascript
import { BCGColor, BCGDrawing, BCGFont } from 'barcode-bakery-common';
import { BCGcode128 } from 'barcode-bakery-1d';

use BarcodeBakery\Common\BCGFontFile;
use BarcodeBakery\Common\BCGColor;
use BarcodeBakery\Common\BCGDrawing;
use BarcodeBakery\Barcode\BCGcode128;

let font = new BCGFontFile('Arial', 18);
let colorFront = new BCGColor(0, 0, 0);
let colorBack = new BCGColor(255, 255, 255);

// Barcode Part
let code = new BCGcode128();
code.setScale(2); // Resolution
code.setThickness(30); // Thickness
code.setBackgroundColor(colorWhite); // Color of spaces
code.setForegroundColor(colorBlack); // Color of bars
code.setFont(font); // Font (or 0)
code.setStart(null);
code.setTilde(true);
code.parse('a123'); // Text

let drawing = new BCGDrawing(code, colorWhite);
drawing.toBuffer(BCGDrawing.ImageFormat.Png, function (err, buffer) {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    response.end(buffer);
});
```

### Saving the image to a file
Replace the last line of the previous code with the following:
```javascript
var drawing = new BCGDrawing(code, colorBack);
drawing.save('image.png', BCGDrawing.ImageFormat.Png, function() {
    console.log('Done.');
});
```

This will generate the following:
<br />
<img src="https://www.barcodebakery.com/images/code-128-github.png">

### Sync methods
Both `save` and `toBuffer` have counterparts acting synchronously: `saveSync` and `toBufferSync`.

## Tests
Simply type `npm test` to run the tests.


Supported types
---------------
* [Codabar][6]
* [Code 11][7]
* [Code 128][8]
* [Code 39][9]
* [Code 39 Extended][10]
* [Code 93][11]
* [EAN-13][12]
* [EAN-8][13]
* [Interleaved 2 of 5][16]
* [ISBN-10 / ISBN-13][17]
* [MSI Plessey][18]
* [Other (Custom)][19]
* [Standard 2 of 5][21]
* [UPC Extension 2][22]
* [UPC Extension 5][23]
* [UPC-A][24]
* [UPC-E][25]

Other libraries available for purchase
--------------------------------------
* [PDF417][30]


[1]: https://www.barcodebakery.com
[2]: https://www.barcodebakery.com/en/purchase
[3]: https://www.barcodebakery.com/en/download
[4]: https://www.barcodebakery.com/en/docs/nodejs/guide
[5]: https://www.barcodebakery.com/en/docs/nodejs/barcode/1d
[6]: https://www.barcodebakery.com/en/docs/nodejs/barcode/codabar/api
[7]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code11/api
[8]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code128/api
[9]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code39/api
[10]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code39extended/api
[11]: https://www.barcodebakery.com/en/docs/nodejs/barcode/code93/api
[12]: https://www.barcodebakery.com/en/docs/nodejs/barcode/ean13/api
[13]: https://www.barcodebakery.com/en/docs/nodejs/barcode/ean8/api
[16]: https://www.barcodebakery.com/en/docs/nodejs/barcode/i25/api
[17]: https://www.barcodebakery.com/en/docs/nodejs/barcode/isbn/api
[18]: https://www.barcodebakery.com/en/docs/nodejs/barcode/msi/api
[19]: https://www.barcodebakery.com/en/docs/nodejs/barcode/othercode/api
[21]: https://www.barcodebakery.com/en/docs/nodejs/barcode/s25/api
[22]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upcext2/api
[23]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upcext5/api
[24]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upca/api
[25]: https://www.barcodebakery.com/en/docs/nodejs/barcode/upce/api
[30]: https://www.barcodebakery.com/en/docs/nodejs/barcode/pdf417/api
[32]: https://github.com/barcode-bakery/barcode-dotnet-1d/
[33]: https://github.com/barcode-bakery/barcode-php-1d/
