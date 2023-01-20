/**
 * Holds the initial FPS drop-rate which will be decreased according to level.
 *
 * @type {number}
 */
const INITIAL_DROP_RATE = 48;

/**
 * Holds the multiplier to convert miliseconds (ms) into seconds (s).
 *
 * @type {number}
 */
const MS_TO_S = 1000;

/**
 * Holds the amount of FPS (frames-per-second) the clock should run on.
 *
 * @type {number}
 */
const FPS = 60;

/**
 * @author Thibeau Fuhrer <fuhrer@thibeau.ch>
 */
export default class Clock {
    /**
     * @type {number|null}
     */
    interval_id = null;

    /**
     * @type {number}
     */
    current_level = 0;

    /**
     * @type {Function}
     */
    drop_hook;

    /**
     * @param {Function} drop_hook
     */
    constructor(drop_hook) {
        this.drop_hook = drop_hook;
    }

    /**
     * Decreases the initial FPS drop-rate according to the current level.
     *
     * This function complies with the official game-logic:
     * @see https://meatfighter.com/nintendotetrisai/#Dropping_Tetriminos
     *
     * @return {number}
     */
    getDropRate() {
        let drop_rate = INITIAL_DROP_RATE;
        for (let i = 1, i_max = this.current_level; i <= i_max; i++) {
            switch (true) {
                case (i <= 8): drop_rate -= 5; break;
                case (i === 9): drop_rate -= 2; break;
                case (i === 10): drop_rate -= 1; break;
                case (i === 13): drop_rate -= 1; break;
                case (i === 16): drop_rate -= 1; break;
                case (i === 19): drop_rate -= 1; break;
                case (i === 29): drop_rate -= 1; break;
            }
        }

        return drop_rate;
    }

    start() {
        if (!this.isRunning()) {
            this.interval_id = setInterval(
                () => {
                    // only call the drop-hook if the clock is actually running.
                    if (this.isRunning()) {
                        this.drop_hook();
                    }
                },
                this.getIntervalFor(this.getDropRate())
            );
        }
    }

    pause() {
        if (this.isRunning()) {
            clearInterval(this.interval_id);
            this.interval_id = null;
        }
    }

    /**
     * @param {number} level
     */
    setLevel(level) {
        this.current_level = level;

        if (this.isRunning()) {
            this.pause();
            this.start();
        }
    }

    /**
     * Calculates the miliseconds (ms) interval for the given FPS rate.
     *
     * @param {number} fps_rate
     * @return {number}
     */
    getIntervalFor(fps_rate) {
        return ((1 * MS_TO_S / FPS) * fps_rate);
    }

    /**
     * @return {boolean}
     */
    isRunning() {
        return (null !== this.interval_id);
    }
}
