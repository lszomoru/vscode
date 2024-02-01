/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from 'vs/base/test/common/utils';
import { createTextModel } from 'vs/editor/test/common/testTextModel';
import { generateRandomMultilineString as randomMultilineString } from 'vs/editor/contrib/inlineCompletions/test/browser/utils';
import { MersenneTwister, getRandomEditInfos, toEdit, } from 'vs/editor/test/common/model/bracketPairColorizer/combineTextEditInfos.test';
import { inverseEdits } from 'vs/editor/contrib/inlineCompletions/browser/utils';

suite('getNewRanges', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	for (let seed = 0; seed < 20; seed++) {
		test(`test ${seed}`, () => {
			const randomText = randomMultilineString(seed, 10);
			const model = createTextModel(randomText);

			const rng = new MersenneTwister(seed);
			const edits = getRandomEditInfos(model, rng.nextIntRange(1, 4), rng).map(e => toEdit(e));
			const invEdits = inverseEdits(model, edits);

			model.applyEdits(edits);
			model.applyEdits(invEdits);

			assert.deepStrictEqual(model.getValue(), randomText);
			model.dispose();
		});
	}

});
