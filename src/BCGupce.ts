'use strict';

import { BCGBarcode, BCGBarcode1D, BCGParseException, BCGLabel, Utility, draw } from 'barcode-bakery-common';

/**
 * Constructor.
 */
class BCGupce extends BCGBarcode1D {
    private readonly codeParity: number[][][];

    /**
     * The UPCE value.
     */
    protected upce: string | null = null;

    /**
     * The label on the left.
     */
    protected labelLeft: BCGLabel | null = null;

    /**
     * The label on the center.
     */
    protected labelCenter: BCGLabel | null = null;

    /**
     * The label on the right.
     */
    protected labelRight: BCGLabel | null = null;

    constructor() {
        super();

        this.codeParity = [];
        this.labelLeft = null;
        this.labelCenter = null;
        this.labelRight = null;

        this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        // Odd Parity starting with a space
        // Even Parity is the inverse (0=0012) starting with a space
        this.code = [
            '2100',     /* 0 */
            '1110',     /* 1 */
            '1011',     /* 2 */
            '0300',     /* 3 */
            '0021',     /* 4 */
            '0120',     /* 5 */
            '0003',     /* 6 */
            '0201',     /* 7 */
            '0102',     /* 8 */
            '2001'      /* 9 */
        ];

        // Parity, 0=Odd, 1=Even for manufacturer code. Depending on 1st System Digit and Checksum
        this.codeParity = [
            [
                [1, 1, 1, 0, 0, 0], /* 0,0 */
                [1, 1, 0, 1, 0, 0], /* 0,1 */
                [1, 1, 0, 0, 1, 0], /* 0,2 */
                [1, 1, 0, 0, 0, 1], /* 0,3 */
                [1, 0, 1, 1, 0, 0], /* 0,4 */
                [1, 0, 0, 1, 1, 0], /* 0,5 */
                [1, 0, 0, 0, 1, 1], /* 0,6 */
                [1, 0, 1, 0, 1, 0], /* 0,7 */
                [1, 0, 1, 0, 0, 1], /* 0,8 */
                [1, 0, 0, 1, 0, 1]  /* 0,9 */
            ],
            [
                [0, 0, 0, 1, 1, 1], /* 0,0 */
                [0, 0, 1, 0, 1, 1], /* 0,1 */
                [0, 0, 1, 1, 0, 1], /* 0,2 */
                [0, 0, 1, 1, 1, 0], /* 0,3 */
                [0, 1, 0, 0, 1, 1], /* 0,4 */
                [0, 1, 1, 0, 0, 1], /* 0,5 */
                [0, 1, 1, 1, 0, 0], /* 0,6 */
                [0, 1, 0, 1, 0, 1], /* 0,7 */
                [0, 1, 0, 1, 1, 0], /* 0,8 */
                [0, 1, 1, 0, 1, 0]  /* 0,9 */
            ]
        ];
    }

    /**
     * Draws the barcode.
     *
     * @param image The surface.
     */
    draw(image: draw.Surface): void {
        this.calculateChecksum();
        if (this.checksumValue === null) {
            throw new Error();
        }

        // Starting Code
        this.drawChar(image, '000', true);
        let c = this.upce!.length; // !It has been validated
        for (let i = 0; i < c; i++) {
            this.drawChar(image, BCGupce.inverse(this.findCode(this.upce![i])!, this.codeParity[parseInt(this.text[0], 10)][this.checksumValue[0]][i]), false); // !It has been validated
        }

        // Draw Center Guard Bar
        this.drawChar(image, '00000', false);

        // Draw Right Bar
        this.drawChar(image, '0', true);
        this.text = this.text[0] + this.upce;
        this.drawText(image, 0, 0, this.positionX, this.thickness);

        if (this.isDefaultEanLabelEnabled()) {
            if (this.labelCenter === null) {
                throw new Error();
            }

            let dimension = this.labelCenter.getDimension();
            this.drawExtendedBars(image, dimension[1] - 2);
        }
    }

    /**
     * Returns the maximal size of a barcode.
     * [0]->width
     * [1]->height
     *
     * @param width The width.
     * @param height The height.
     * @return An array, [0] being the width, [1] being the height.
     */
    getDimension(width: number, height: number): [number, number] {
        let startlength = 3;
        let centerlength = 5;
        let textlength = 6 * 7;
        let endlength = 1;

        width += startlength + centerlength + textlength + endlength;
        height += this.thickness;
        return super.getDimension(width, height);
    }

    /**
     * Adds the default label.
     */
    protected addDefaultLabel(): void {
        if (this.upce === null) {
            throw new Error();
        }

        if (this.isDefaultEanLabelEnabled()) {
            this.processChecksum();
            if (this.checksumValue === null) {
                throw new Error();
            }

            let font = this.font;

            this.labelLeft = new BCGLabel(this.text.substr(0, 1), font, BCGLabel.Position.Left, BCGLabel.Alignment.Bottom);
            let labelLeftDimension = this.labelLeft.getDimension();
            this.labelLeft.setSpacing(8);
            this.labelLeft.setOffset(labelLeftDimension[1] / 2);

            this.labelCenter = new BCGLabel(this.upce!, font, BCGLabel.Position.Bottom, BCGLabel.Alignment.Left);
            let labelCenterDimension = this.labelCenter.getDimension();
            this.labelCenter.setOffset((this.scale * 46 - labelCenterDimension[0]) / 2 + this.scale * 2);

            this.labelRight = new BCGLabel(this.keys[this.checksumValue[0]], font, BCGLabel.Position.Right, BCGLabel.Alignment.Bottom);
            let labelRightDimension = this.labelRight.getDimension();
            this.labelRight.setSpacing(8);
            this.labelRight.setOffset(labelRightDimension[1] / 2);

            this.addLabel(this.labelLeft);
            this.addLabel(this.labelCenter);
            this.addLabel(this.labelRight);
        }
    }

    /**
     * Checks if the default ean label is enabled.
     *
     * @return True if default label is enabled.
     */
    protected isDefaultEanLabelEnabled(): boolean {
        let label = this.getLabel();
        let font = this.font;
        return label !== null && label !== '' && font !== null && this.defaultLabel !== null;
    }

    /**
     * Validates the input.
     */
    protected validate(): void {
        let c = this.text.length;
        if (c === 0) {
            throw new BCGParseException('Upce', 'No data has been entered.');
        }

        // Checking if all chars are allowed
        for (let i = 0; i < c; i++) {
            if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
                throw new BCGParseException('Upce', 'The character \'' + this.text[i] + '\' is not allowed.');
            }
        }

        // Must contain 11 chars
        // Must contain 6 chars (if starting with Upce directly)
        // First Chars must be 0 or 1
        if (c !== 11 && c !== 6) {
            throw new BCGParseException('Upce', 'You must provide a UPC-A (11 characters) or a UPC-E (6 characters).');
        } else if (this.text[0] !== '0' && this.text[0] !== '1' && c !== 6) {
            throw new BCGParseException('Upce', 'UPC-A must start with 0 or 1 to be converted to UPC-E.');
        }

        // Convert part
        this.upce = '';
        if (c !== 6) {
            // Checking if UPC-A is convertible
            let temp1 = this.text.substr(3, 3);
            if (temp1 === '000' || temp1 === '100' || temp1 === '200') { // manufacturer code ends with 100, 200 or 300
                if (this.text.substr(6, 2) === '00') { // Product must start with 00
                    this.upce = this.text.substr(1, 2) + this.text.substr(8, 3) + this.text.substr(3, 1);
                }
            } else if (this.text.substr(4, 2) === '00') { // manufacturer code ends with 00
                if (this.text.substr(6, 3) === '000') { // Product must start with 000
                    this.upce = this.text.substr(1, 3) + this.text.substr(9, 2) + '3';
                }
            } else if (this.text.substr(5, 1) === '0') { // manufacturer code ends with 0
                if (this.text.substr(6, 4) === '0000') { // Product must start with 0000
                    this.upce = this.text.substr(1, 4) + this.text.substr(10, 1) + '4';
                }
            } else { // No zero leading at manufacturer code
                let temp2 = parseInt(this.text.substr(10, 1), 10);
                if (this.text.substr(6, 4) === '0000' && temp2 >= 5 && temp2 <= 9) { // Product must start with 0000 and must end by 5, 6, 7, 8 or 9
                    this.upce = this.text.substr(1, 5) + this.text.substr(10, 1);
                }
            }
        } else {
            this.upce = this.text;
        }

        if (this.upce === '') {
            throw new BCGParseException('Upce', 'Your UPC-A can\'t be converted to UPC-E.');
        }

        if (c === 6) {
            let upca = '';

            // We convert UPC-E to UPC-A to find the checksum
            if (this.text[5] === '0' || this.text[5] === '1' || this.text[5] === '2') {
                upca = this.text.substr(0, 2) + this.text[5] + '0000' + this.text.substr(2, 3);
            } else if (this.text[5] === '3') {
                upca = this.text.substr(0, 3) + '00000' + this.text.substr(3, 2);
            } else if (this.text[5] === '4') {
                upca = this.text.substr(0, 4) + '00000' + this.text[4];
            } else {
                upca = this.text.substr(0, 5) + '0000' + this.text[5];
            }

            this.text = '0' + upca;
        }

        super.validate();
    }

    /**
     * Overloaded method to calculate checksum.
     */
    protected calculateChecksum(): void {
        // Calculating Checksum
        // Consider the right-most digit of the message to be in an "odd" position,
        // and assign odd/even to each character moving from right to left
        // Odd Position = 3, Even Position = 1
        // Multiply it by the number
        // Add all of that and do 10-(?mod10)
        let odd = true;
        this.checksumValue = [0];
        let c = this.text.length;
        let multiplier;
        for (let i = c; i > 0; i--) {
            if (odd === true) {
                multiplier = 3;
                odd = false;
            } else {
                multiplier = 1;
                odd = true;
            }

            if (Utility.arraySearch(this.keys, this.text[i - 1]) === -1) {
                return;
            }

            let n1 = parseInt(this.text[i - 1], 10);
            let n2 = parseInt(this.keys[n1], 10);
            this.checksumValue[0] += n2 * multiplier;
        }

        this.checksumValue[0] = (10 - this.checksumValue[0] % 10) % 10;
    }

    /**
     * Overloaded method to display the checksum.
     *
     * @return The checksum value.
     */
    protected processChecksum(): string | null {
        if (this.checksumValue === null) { // Calculate the checksum only once
            this.calculateChecksum();
        }

        if (this.checksumValue !== null) {
            return this.keys[this.checksumValue[0]];
        }

        return null;
    }

    /**
     * Draws the extended bars on the image.
     *
     * @param image The surface.
     * @param plus How much more we should display the bars.
     */
    protected drawExtendedBars(image: draw.Surface, plus: number): void {
        let rememberX = this.positionX;
        let rememberH = this.thickness;

        // We increase the bars
        this.thickness = this.thickness + parseInt((plus / this.scale).toString(), 10);
        this.positionX = 0;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);
        this.positionX += 2;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);
        let code1 = this.positionX;

        // Last Bars
        this.positionX += 46;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);
        this.positionX += 2;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);

        this.positionX = rememberX;
        this.thickness = rememberH;
    }

    /**
     * Inverses the string when the inverse parameter is equal to 1.
     *
     * @param text The text.
     * @param inverse The inverse.
     * @return string The reversed string.
     */
    private static inverse(text: string, inverse: number): string {
        if (inverse === 1) {
            text = Utility.strrev(text);
        }

        return text;
    }
}

export { BCGupce }
