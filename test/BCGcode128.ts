'use strict';

import 'mocha';
import { strictEqual, deepStrictEqual } from 'assert';
import { BCGLabel } from '@barcode-bakery/barcode-common';
import { BCGcode128 } from '../src/BCGcode128';

let code = 'Code128',
    defaultText = 'Hello',
    secondText = 'Bonjour';
describe(code, function () {
    let instance: BCGcode128;

    function getProtectedField(fieldName: string): any {
        return (instance as any)[fieldName];
    }

    function getPrivateField(fieldName: string): any {
        return (instance as any)[fieldName];
    }

    beforeEach(function () {
        instance = new BCGcode128();
    });

    describe('#label', function () {
        it('should behave properly with some text', function () {
            instance.parse(defaultText);
            strictEqual(instance.getLabel(), defaultText);

            instance.setLabel(secondText);
            strictEqual(instance.getLabel(), secondText);
        });

        it('should behave properly with other text', function () {
            instance.parse(secondText);
            strictEqual(instance.getLabel(), secondText);

            instance.setLabel(defaultText);
            strictEqual(instance.getLabel(), defaultText);
        });
    });

    describe('#maxSize', function () {
        let textLength = 8 * 11; /*Hello contains 8 data character*/

        describe('with no label', function () {
            it('should work with scale=1', function () {
                let scale = 1;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                deepStrictEqual(instance.getDimension(0, 0), [(textLength + 2) * scale, (30) * scale]);
            });

            it('should work with scale=2 and extra positioning', function () {
                let scale = 2,
                    left = 5,
                    top = 10;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                deepStrictEqual(instance.getDimension(left, top), [(textLength + 2 + left) * scale, (30 + top) * scale]);
            });

            it('should work with scale=2 and extra positioning and offset', function () {
                let scale = 2,
                    left = 5,
                    top = 10,
                    offsetX = 20,
                    offsetY = 30;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.setOffsetX(offsetX);
                instance.setOffsetY(offsetY);
                instance.parse(defaultText);
                deepStrictEqual(instance.getDimension(left, top), [(textLength + 2 + left + offsetX) * scale, (30 + top + offsetY) * scale]);
            });
        });

        describe('with one label', function () {
            it('should work with scale=1', function () {
                let scale = 1;
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                let label = getProtectedField('defaultLabel');
                let dimension = label.getDimension();
                strictEqual(label.getPosition(), BCGLabel.Position.Bottom);
                deepStrictEqual(instance.getDimension(0, 0), [(textLength + 2) * scale, (30) * scale + dimension[1]]);
            });

            it('should work with scale=2', function () {
                let scale = 2;
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                let label = getProtectedField('defaultLabel');
                let dimension = label.getDimension();
                strictEqual(label.getPosition(), BCGLabel.Position.Bottom);
                deepStrictEqual(instance.getDimension(0, 0), [(textLength + 2) * scale, (30) * scale + dimension[1]]);
            });
        });
    });
});
