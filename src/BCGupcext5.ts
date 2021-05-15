'use strict';

import { BCGBarcode1D, BCGParseException, BCGLabel, Utility, draw } from 'barcode-bakery-common';

/**
 * Constructor.
 */
class BCGupcext5 extends BCGBarcode1D {
    private readonly codeParity: number[][];

    constructor() {
        super();
        this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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

        // Parity, 0=Odd, 1=Even. Depending Checksum
        this.codeParity = [
            [1, 1, 0, 0, 0],    /* 0 */
            [1, 0, 1, 0, 0],    /* 1 */
            [1, 0, 0, 1, 0],    /* 2 */
            [1, 0, 0, 0, 1],    /* 3 */
            [0, 1, 1, 0, 0],    /* 4 */
            [0, 0, 1, 1, 0],    /* 5 */
            [0, 0, 0, 1, 1],    /* 6 */
            [0, 1, 0, 1, 0],    /* 7 */
            [0, 1, 0, 0, 1],    /* 8 */
            [0, 0, 1, 0, 1]     /* 9 */
        ];
    }

    /**
     * Draws the barcode.
     *
     * @param image The surface.
     */
    draw(image: draw.Surface): void {
        // Checksum
        this.calculateChecksum();
        if (this.checksumValue === null) {
            throw new Error();
        }

        // Starting Code
        this.drawChar(image, '001', true);

        // Code
        for (let i = 0; i < 5; i++) {
            this.drawChar(image, BCGupcext5.inverse(this.findCode(this.text[i])!, this.codeParity[this.checksumValue[0]][i]), false); // !It has been validated
            if (i < 4) {
                this.drawChar(image, '00', false); // Inter-char
            }
        }

        this.drawText(image, 0, 0, this.positionX, this.thickness);
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
        let startlength = 4;
        let textlength = 5 * 7;
        let intercharlength = 2 * 4;

        width += startlength + textlength + intercharlength;
        height += this.thickness;
        return super.getDimension(width, height);
    }

    /**
     * Adds the default label.
     */
    protected addDefaultLabel(): void {
        super.addDefaultLabel();

        if (this.defaultLabel !== null) {
            this.defaultLabel.setPosition(BCGLabel.Position.Top);
        }
    }

    /**
     * Validates the input.
     */
    protected validate(): void {
        let c = this.text.length;
        if (c === 0) {
            throw new BCGParseException('Upcext5', 'No data has been entered.');
        }

        // Checking if all chars are allowed
        for (let i = 0; i < c; i++) {
            if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
                throw new BCGParseException('Upcext5', 'The character \'' + this.text[i] + '\' is not allowed.');
            }
        }

        // Must contain 5 digits
        if (c !== 5) {
            throw new BCGParseException('Upcext5', 'Must contain 5 digits.');
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
        // Odd Position = 3, Even Position = 9
        // Multiply it by the number
        // Add all of that and do ?mod10
        let odd = true;
        this.checksumValue = [0];
        let c = this.text.length;
        let multiplier;
        for (let i = c; i > 0; i--) {
            if (odd === true) {
                multiplier = 3;
                odd = false;
            } else {
                multiplier = 9;
                odd = true;
            }

            if (Utility.arraySearch(this.keys, this.text[i - 1]) === -1) {
                return;
            }

            let n1 = parseInt(this.text[i - 1], 10);
            let n2 = parseInt(this.keys[n1], 10);
            this.checksumValue[0] += n2 * multiplier;
        }

        this.checksumValue[0] = this.checksumValue[0] % 10;
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

export { BCGupcext5 }
