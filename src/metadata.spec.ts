import 'mocha';
import { expect } from 'chai';

import { TestGlobals } from './test_globals';

describe('Metadata', () => {

  it.only('should list out all public extrinsics in the system', async () => {
      let extrinsics = [];
      let count = 0;
      Object.keys(TestGlobals.connection.api.tx).forEach(key => {
        Object.keys(TestGlobals.connection.api.tx[key]).forEach(v => {
            extrinsics.push(key + '.' + v);
            // printing for documentation
            console.log('|' + count + '|', key, '|', v, '|-|');
            count++;
        });
      });
      expect(count).to.equal(17);
      // dummy check
      expect(extrinsics.length).to.equal(count);
  });
});