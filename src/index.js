/**
 * This is the bootstrap file for all javascrip logic in this repository.
 *
 * @author Thibeau Fuhrer <fuhrer@thibeau.ch>
 *
 * The repository is using rollup.js for module bundeling and bundles this
 * file into a minified version located at /dist/main.min.js.
 *
 * The configuration file is /rollup.config.js and after every change of
 * javascript logic the file must be re-bundled by performing:
 *
 * ```bash
 * npx rollup -c rollup.config.js
 * ```
 */

import Tetris from "./Tetris/tetris.class.js";

window.onload = (function () {

})();