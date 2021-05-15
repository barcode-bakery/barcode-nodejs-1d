﻿'use strict';

import { equal, ok } from 'assert';
import { BCGFont, BCGBarcode1D, BCGBarcode } from 'barcode-bakery-common';
import { BCGcodabar } from '../src/BCGcodabar';
import { BCGcode11 } from '../src/BCGcode11';
import { BCGcode128 } from '../src/BCGcode128';
import { BCGcode39 } from '../src/BCGcode39';
import { BCGcode39extended } from '../src/BCGcode39extended';
import { BCGcode93 } from '../src/BCGcode93';
import { BCGean13 } from '../src/BCGean13';
import { BCGean8 } from '../src/BCGean8';
import { BCGi25 } from '../src/BCGi25';
import { BCGisbn } from '../src/BCGisbn';
import { BCGmsi } from '../src/BCGmsi';
import { BCGothercode } from '../src/BCGothercode';
import { BCGs25 } from '../src/BCGs25';
import { BCGupca } from '../src/BCGupca';
import { BCGupce } from '../src/BCGupce';
import { BCGupcext2 } from '../src/BCGupcext2';
import { BCGupcext5 } from '../src/BCGupcext5';

let x: { new(): BCGBarcode1D } = BCGcodabar;

let barcodes: [{ new(): BCGBarcode1D }, string][] = [
    [BCGcodabar, 'A12345B'],
    [BCGcode11, '12345'],
    [BCGcode128, 'Hello'],
    [BCGcode39, 'HELLO'],
    [BCGcode39extended, 'HELLO'],
    [BCGcode93, 'HELLO'],
    [BCGean13, '123456789012'],
    [BCGean8, '1234567'],
    [BCGi25, '123456'],
    [BCGisbn, '123456789123'],
    [BCGmsi, '12345'],
    [BCGothercode, '0123456789'],
    [BCGs25, '123456'],
    [BCGupca, '12345678901'],
    [BCGupce, '123456'],
    [BCGupcext2, '12'],
    [BCGupcext5, '12345']
];

barcodes.forEach(function (check) {
    let code = check[0];
    let text = check[1];

    describe(code.name.toString(), function () {
        let instance: BCGBarcode1D;

        function getProtectedField(fieldName: string): any {
            return (instance as any)[fieldName];
        }

        function getPrivateField(fieldName: string): any {
            return (instance as any)[fieldName];
        }

        beforeEach(function () {
            instance = new code() as BCGBarcode1D;
        });

        describe('#getThickness()', function () {
            it('should return 30 by default', function () {
                let thickness = instance.getThickness();
                equal(30, thickness);
            });
        });

        describe('#label', function () {
            it('should behave properly', function () {
                instance.setDisplayChecksum(false);
                equal(BCGBarcode1D.AUTO_LABEL, getProtectedField('label'));

                instance.setLabel(null);
                equal(instance.getLabel(), null);
            });
        });

        describe('#font', function () {
            it('should behave properly', function () {
                ok(instance.getFont() instanceof BCGFont);
            });
        });
    });
});
