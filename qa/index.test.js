import test from 'node:test';
import assert from 'assert';
import {canStillWatch, logger} from '../helpers/index.js'
import db from '../db.json' assert {type: "json"};;

test('index helper', async (t) => {
    // This test passes because it does not throw an exception.

    await  t.test('confirm db data', () => {
        assert.strictEqual(db['cmF3azp0ZXN0'][0].id, '12345');
    })


    await t.test('canStillWatch', () => {

        assert.deepEqual(canStillWatch(db['cmF3azp0ZXN0']), {count: 2, status: true});
    })

 
});

 