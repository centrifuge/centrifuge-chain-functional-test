import 'mocha';
import { expect } from 'chai';

import { Anchoring } from './anchoring';
import { TestGlobals } from './test_globals';

describe('Anchoring', async () => {

  describe('Commit', async () => {

    it('should commit anchor', async () => {
      console.log(TestGlobals.testConfig);
      const result = new Anchoring();
      //result.commit();
      expect(result).to.equal('Hello world!');
    });

  });

});