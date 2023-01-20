import Clock from "../../../src/Tetris/Clock/clock.class.js";
import {assert, expect} from "chai";

/**
 * Tests if all levels between the two provided ones all constatly decrease the FPS
 * drop-rate for the specified amount.
 *
 * @param {number} from_level
 * @param {number} to_level
 * @param {number} decrease
 * @param {number} initial_rate=48
 * @return {number}
 */
function testDropRateDecreaseOfLevels(from_level, to_level, decrease, initial_rate = 48) {
    let clock = new Clock(function() {});
    let previous_value = initial_rate;

    for (let level = from_level; level <= to_level; level++) {
        clock.setLevel(level);
        let current_rate = clock.getDropRate();

        assert.strictEqual(current_rate, (previous_value - decrease));
        previous_value = current_rate;
    }

    return previous_value;
}

/**
 * Halts the execution of the test for the given amount of time in milisecods (ms).
 * Note that this method returns a Promise which has to be awaited.
 *
 * @param {number} time_in_ms
 * @return {Promise<boolean>}
 */
function pauseTestCaseFor(time_in_ms) {
    return new Promise(resolve => setTimeout(resolve, time_in_ms));
}

/**
 * @author Thibeau Fuhrer <fuhrer@thibeau.ch>
 */
describe('Tetris Clock', function () {

    it('FPS drop-rates are properly decreased on each level.', function () {
        // level 1 to 8 should decrease the initial drop rate by 5 each level.
        let level_08_drop_rate = testDropRateDecreaseOfLevels(1, 8, 5);

        // level 9 should decrease the drop-rate of level 8 by 2.
        let level_09_drop_rate = testDropRateDecreaseOfLevels(9, 9, 2, level_08_drop_rate);

        // levels after 9 should decrease the drop-rate by 1 at these breakpoints: 13, 16, 19 and 29.
        let level_12_drop_rate = testDropRateDecreaseOfLevels(10, 12, 0, (level_09_drop_rate - 1));
        let level_15_drop_rate = testDropRateDecreaseOfLevels(13, 15, 0, (level_12_drop_rate - 1));
        let level_18_drop_rate = testDropRateDecreaseOfLevels(16, 18, 0, (level_15_drop_rate - 1));
        let level_28_drop_rate = testDropRateDecreaseOfLevels(19, 28, 0, (level_18_drop_rate - 1));

        // the drop-rate after level 29 should be locked at 1.
        let level_99_drop_rate = testDropRateDecreaseOfLevels(29, 99, 0, (level_28_drop_rate - 1));
    });

    it('Can prevent calling the drop-hook while not actually running.', async function () {
        let has_been_called = false;
        let test_hook = function () {
            has_been_called = true;
        };

        let clock = new Clock(test_hook);
        clock.setLevel(30);
        clock.start();
        clock.pause();

        // wait slightly more than the clock's interval for the current drop rate before
        // testing whether the hook has been called or not.
        await pauseTestCaseFor(clock.getIntervalFor(clock.getDropRate()) + 1);

        assert.strictEqual(has_been_called, false);
    });

    it('Can call the drop-hook while actually running.', async function () {
        let clock = undefined;
        let has_been_called = false;
        let test_hook = function () {
            has_been_called = true;
            clock.pause();
        };

        clock = new Clock(test_hook);
        clock.setLevel(30);
        clock.start();

        // wait slightly more than the clock's interval for the current drop rate before
        // testing whether the hook has been called or not.
        await pauseTestCaseFor(clock.getIntervalFor(clock.getDropRate()) + 1);

        assert.strictEqual(has_been_called, true);
    });

});
