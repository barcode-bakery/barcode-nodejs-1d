'use strict';

import { BCGBarcode, BCGBarcode1D, BCGParseException, BCGLabel, Utility, draw } from 'barcode-bakery-common';

/**
 * Constructor.
 */
class BCGean8 extends BCGBarcode1D {
    /**
     * The label on the left.
     */
    protected labelLeft: BCGLabel | null = null;

    /**
     * The label on the right.
     */
    protected labelRight: BCGLabel | null = null;

    constructor() {
        super();

        this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        // Left-Hand Odd Parity starting with a space
        // Right-Hand is the same of Left-Hand starting with a bar
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
    }

    /**
     * Draws the barcode.
     *
     * @param surface The surface.
     */
    draw(surface: draw.Surface): void {
        // Checksum
        this.calculateChecksum();

        if (this.checksumValue === null) {
            throw new Error();
        }

        let tempText = this.text + this.keys[this.checksumValue[0]];

        // Starting Code
        this.drawChar(surface, '000', true);

        // Draw First 4 Chars (Left-Hand)
        for (let i = 0; i < 4; i++) {
            this.drawChar(surface, this.findCode(tempText[i])!, false); // !It has been validated
        }

        // Draw Center Guard Bar
        this.drawChar(surface, '00000', false);

        // Draw Last 4 Chars (Right-Hand)
        for (let i = 4; i < 8; i++) {
            this.drawChar(surface, this.findCode(tempText[i])!, true); // !It has been validated
        }

        // Draw Right Guard Bar
        this.drawChar(surface, '000', true);
        this.drawText(surface, 0, 0, this.positionX, this.thickness);

        if (this.isDefaultEanLabelEnabled()) {
            if (this.labelRight === null) {
                throw new Error();
            }

            let dimension = this.labelRight.getDimension();
            this.drawExtendedBars(surface, dimension[1] - 2);
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
        let textlength = 8 * 7;
        let endlength = 3;

        width += startlength + centerlength + textlength + endlength;
        height += this.thickness;
        return super.getDimension(width, height);
    }

    /**
     * Adds the default label.
     */
    protected addDefaultLabel(): void {
        if (this.isDefaultEanLabelEnabled()) {
            this.processChecksum();

            if (this.checksumValue === null) {
                throw new Error();
            }

            let label = this.getLabel();
            if (label === null) {
                throw new Error();
            }

            let font = this.font;

            this.labelLeft = new BCGLabel(label.substr(0, 4), font, BCGLabel.Position.Bottom, BCGLabel.Alignment.Left);
            let labelLeftDimension = this.labelLeft.getDimension();
            this.labelLeft.setOffset((this.scale * 30 - labelLeftDimension[0]) / 2 + this.scale * 2);

            this.labelRight = new BCGLabel(label.substr(4, 3) + this.keys[this.checksumValue[0]], font, BCGLabel.Position.Bottom, BCGLabel.Alignment.Left);
            let labelRightDimension = this.labelRight.getDimension();
            this.labelRight.setOffset((this.scale * 30 - labelRightDimension[0]) / 2 + this.scale * 34);

            this.addLabel(this.labelLeft);
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
            throw new BCGParseException('Ean8', 'No data has been entered.');
        }

        // Checking if all chars are allowed
        for (let i = 0; i < c; i++) {
            if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
                throw new BCGParseException('Ean8', 'The character \'' + this.text[i] + '\' is not allowed.');
            }
        }

        // If we have 8 chars just flush the last one
        if (c === 8) {
            this.text = this.text.substr(0, 7);
        } else if (c !== 7) {
            throw new BCGParseException('Ean8', 'Must contain 7 digits, the 8th digit is automatically added.');
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
    private drawExtendedBars(image: draw.Surface, plus: number): void {
        let rememberX = this.positionX;
        let rememberH = this.thickness;

        // We increase the bars
        this.thickness = this.thickness + parseInt((plus / this.scale).toString(), 10);
        this.positionX = 0;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);
        this.positionX += 2;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);

        // Center Guard Bar
        this.positionX += 30;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);
        this.positionX += 2;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);

        // Last Bars
        this.positionX += 30;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);
        this.positionX += 2;
        this.drawSingleBar(image, BCGBarcode.COLOR_FG);

        this.positionX = rememberX;
        this.thickness = rememberH;
    }
}

export { BCGean8 }
