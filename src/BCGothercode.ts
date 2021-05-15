'use strict';

import { BCGBarcode1D, BCGParseException, Utility, draw } from 'barcode-bakery-common';

/**
 * Constructor.
 */
class BCGothercode extends BCGBarcode1D {
    constructor() {
        super();
        this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    }

    /**
     * Draws the barcode.
     *
     * @param image The surface.
     */
    draw(image: draw.Surface): void {
        this.drawChar(image, this.text, true);
        this.drawText(image, 0, 0, this.positionX, this.thickness);
    }

    /**
     * Gets the label.
     * If the label was set to BCGBarcode1D::AUTOlabel, the label will display the value from the text parsed.
     *
     * @return The label string.
     */
    getLabel(): string | null {
        let label = this.label;
        if (this.label === BCGBarcode1D.AUTO_LABEL) {
            label = '';
        }

        return label;
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
        let array = this.text.split('').map(Number);
        let textlength = Utility.arraySum(array) + array.length;

        width += textlength;
        height += this.thickness;
        return super.getDimension(width, height);
    }

    /**
     * Validates the input.
     */
    protected validate(): void {
        let c = this.text.length;
        if (c === 0) {
            throw new BCGParseException('OtherCode', 'No data has been entered.');
        }

        // Checking if all chars are allowed
        for (let i = 0; i < c; i++) {
            if (Utility.arraySearch(this.keys, this.text[i]) === -1) {
                throw new BCGParseException('OtherCode', 'The character \'' + this.text[i] + '\' is not allowed.');
            }
        }

        super.validate();
    }
}

export { BCGothercode }
