import 'mocha';
import { expect } from 'chai';

import { Anchoring } from './anchoring';
import { TestGlobals } from './test_globals';
import { newRandomCommitParam, newRandomAnchorParams } from './testutil';
import { u8aToHex } from '@polkadot/util';

describe('Anchoring', async () => {

  before(() => {
    console.log(TestGlobals.testConfig);
  });

  it('should commit anchor and not allow the same to be committed again', (cb) => {
    const anchorer = new Anchoring(TestGlobals.api);
    let ancParam = newRandomCommitParam();
    anchorer.commit(ancParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          let anchor = await anchorer.findAnchor(ancParam.getAnchorId());
          expect(anchor.docRoot).to.equal(ancParam.docRoot);
          expect(anchor.id).to.equal(ancParam.getAnchorId());

          // committing same anchor twice must FAIL
          anchorer.commit(ancParam).signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
            if (status.isFinalized) {
              // find the anchored event
              events.forEach(async ({ phase, event: { data, method, section } }) => {
                if (section === 'system') {
                  expect(method).to.equal('ExtrinsicFailed');
                  cb();
                }
              });
            }
          });
        }
      });
  });

  it('should pre-commit anchor and not allow to pre-commit the same before expiration', (cb) => {
    const anchorer = new Anchoring(TestGlobals.api);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          let anchor = await anchorer.findPreAnchor(ancParam.preAnchorParam.anchorId);
          expect(anchor.signingRoot).to.equal(ancParam.preAnchorParam.signingRoot);
          expect(anchor.identity).to.equal(u8aToHex(TestGlobals.accMan.getAccountByIndex(0).publicKey));

          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.preCommit(ancParam.preAnchorParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(1), async ({ events = [], status }) => {
              if (status.isFinalized) {
                events.forEach(async ({ phase, event: { data, method, section } }) => {
                  if (section === 'system') {
                    expect(method).to.equal('ExtrinsicFailed');
                    cb();
                  }
                });
              }
            });
        }
      });
  });

  it('should pre-commit and the commit anchor with document proof', (cb) => {
    const anchorer = new Anchoring(TestGlobals.api);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.commit(ancParam.anchorParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
              if (status.isFinalized) {
                let anchor = await anchorer.findAnchor(ancParam.anchorParam.getAnchorId());
                expect(anchor.docRoot).to.equal(ancParam.anchorParam.docRoot);
                expect(anchor.id).to.equal(ancParam.anchorParam.getAnchorId());
                cb();
              }
            });
        }
      });
  });

  it('should pre-commit and the commit anchor from another account must fail', (cb) => {
    const anchorer = new Anchoring(TestGlobals.api);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.commit(ancParam.anchorParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(1), async ({ events = [], status }) => {
              if (status.isFinalized) {
                events.forEach(async ({ phase, event: { data, method, section } }) => {
                  if (section === 'system') {
                    expect(method).to.equal('ExtrinsicFailed');
                    cb();
                  }
                });
              }
            });
        }
      });
  });

  after(async () => {
    TestGlobals.api.disconnect();
  });

});
