'use strict';

import 'mocha';
import { equal, deepEqual } from 'assert';
import { BCGLabel } from 'barcode-bakery-common';
import { BCGothercode } from '../src/BCGothercode';

let code = 'OtherCode',
    defaultText = '0123456789',
    secondText = '9876543210';
describe(code, function () {
    let instance: BCGothercode;

    function getProtectedField(fieldName: string): any {
        return (instance as any)[fieldName];
    }

    function getPrivateField(fieldName: string): any {
        return (instance as any)[fieldName];
    }

    beforeEach(function () {
        instance = new BCGothercode();
    });

    describe('#label', function () {
        it('should behave properly with some text', function () {
            instance.parse(defaultText);
            equal(instance.getLabel(), '');

            instance.setLabel(secondText);
            equal(instance.getLabel(), secondText);
        });

        it('should behave properly with other text', function () {
            instance.parse(secondText);
            equal(instance.getLabel(), '');

            instance.setLabel(defaultText);
            equal(instance.getLabel(), defaultText);
        });
    });

    describe('#maxSize', function () {
        describe('with no label', function () {
            it('should work with scale=1', function () {
                let scale = 1;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                deepEqual([(55) * scale, (30) * scale], instance.getDimension(0, 0));
            });

            it('should work with scale=2 and extra positioning', function () {
                let scale = 2,
                    left = 5,
                    top = 10;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                deepEqual([(55 + left) * scale, (30 + top) * scale], instance.getDimension(left, top));
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
                deepEqual([(55 + left + offsetX) * scale, (30 + top + offsetY) * scale], instance.getDimension(left, top));
            });
        });

        describe('with one label', function () {
            it('should work with scale=1', function () {
                let scale = 1;
                instance.setScale(scale);
                instance.setThickness(30);
                instance.setLabel('A');
                instance.parse(defaultText);
                let label = getProtectedField('defaultLabel');
                let dimension = label.getDimension();
                equal(label.getPosition(), BCGLabel.Position.Bottom);
                deepEqual([(55) * scale, (30) * scale + dimension[1]], instance.getDimension(0, 0));
            });

            it('should work with scale=2', function () {
                let scale = 2;
                instance.setScale(scale);
                instance.setThickness(30);
                instance.setLabel('A');
                instance.parse(defaultText);
                let label = getProtectedField('defaultLabel');
                let dimension = label.getDimension();
                equal(label.getPosition(), BCGLabel.Position.Bottom);
                deepEqual([(55) * scale, (30) * scale + dimension[1]], instance.getDimension(0, 0));
            });
        });
    });
});
