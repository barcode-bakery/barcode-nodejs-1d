'use strict';

import 'mocha';
import { equal, deepEqual } from 'assert';
import { BCGLabel } from 'barcode-bakery-common';
import { BCGcode11 } from '../src/BCGcode11';

let code = 'Code11',
    defaultText = '12345',
    secondText = '987-65';
describe(code, function () {
    let instance: BCGcode11;

    function getProtectedField(fieldName: string): any {
        return (instance as any)[fieldName];
    }

    function getPrivateField(fieldName: string): any {
        return (instance as any)[fieldName];
    }

    beforeEach(function () {
        instance = new BCGcode11();
    });

    describe('#__fields', function () {
        it('should contain the same amount of data', function () {
            equal(getProtectedField('keys').length, getProtectedField('code').length);
        });
    });

    describe('#label', function () {
        it('should behave properly with some text', function () {
            instance.parse(defaultText);
            equal(instance.getLabel(), defaultText);

            instance.setLabel(secondText);
            equal(instance.getLabel(), secondText);
        });

        it('should behave properly with other text', function () {
            instance.parse(secondText);
            equal(instance.getLabel(), secondText);

            instance.setLabel(defaultText);
            equal(instance.getLabel(), defaultText);
        });
    });

    describe('#maxSize', function () {
        let textLength = (6 + 2) /*1*/ + (6 + 2) /*2*/ + (6 + 2) /*3*/ + (6 + 2) /*4*/ + (6 + 2)/*5*/,
            checksumLength = (6 + 2);

        describe('with no label', function () {
            it('should work with scale=1', function () {
                let scale = 1;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                deepEqual([(textLength + 8 + checksumLength + 7) * scale, (30) * scale], instance.getDimension(0, 0));
            });

            it('should work with scale=2 and extra positioning', function () {
                let scale = 2,
                    left = 5,
                    top = 10;
                instance.setLabel(null);
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                deepEqual([(textLength + 8 + checksumLength + 7 + left) * scale, (30 + top) * scale], instance.getDimension(left, top));
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
                deepEqual([(textLength + 8 + checksumLength + 7 + left + offsetX) * scale, (30 + top + offsetY) * scale], instance.getDimension(left, top));
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
                equal(label.getPosition(), BCGLabel.Position.Bottom);
                deepEqual([(textLength + 8 + checksumLength + 7) * scale, (30) * scale + dimension[1]], instance.getDimension(0, 0));
            });

            it('should work with scale=2', function () {
                let scale = 2;
                instance.setScale(scale);
                instance.setThickness(30);
                instance.parse(defaultText);
                let label = getProtectedField('defaultLabel');
                let dimension = label.getDimension();
                equal(label.getPosition(), BCGLabel.Position.Bottom);
                deepEqual([(textLength + 8 + checksumLength + 7) * scale, (30) * scale + dimension[1]], instance.getDimension(0, 0));
            });
        });
    });
});
