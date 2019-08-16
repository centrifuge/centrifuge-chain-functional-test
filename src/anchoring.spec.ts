import 'mocha';
import { expect } from 'chai';

import { Anchoring } from './anchoring';
import { ApiPromise } from '@polkadot/api';
import { connect } from './connect';
import { AccountManager } from './account_manager';
import { newRandomCommitParam, newRandomAnchorParams } from './testutil';
import { u8aToHex } from '@polkadot/util';

// TODO read from env
const WS_PROVIDER='ws://127.0.0.1:9944';

describe('Anchoring', async () => {

  let api: ApiPromise;

  let accMan: AccountManager;

  before(async () => {
    api = await connect(WS_PROVIDER);
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // TODO move this to a place at the route of all tests later
    accMan = new AccountManager();
    await accMan.createTestAccounts(api, 3, 1000000);
  });

  it('should commit anchor and not allow the same to be committed again', (cb) => {
    const anchorer = new Anchoring(api);
    let ancParam = newRandomCommitParam();
    anchorer.commit(ancParam)
      .signAndSend(accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        //console.log('Transaction status:', status.type);
        if (status.isFinalized) {
          let anchor = await anchorer.findAnchor(ancParam.getAnchorId());
          expect(anchor.docRoot).to.equal(ancParam.docRoot);
          expect(anchor.id).to.equal(ancParam.getAnchorId());

          // committing same anchor twice must FAIL
          anchorer.commit(ancParam).signAndSend(accMan.getAccountByIndex(0), async ({ events = [], status }) => {
            //console.log('Transaction status:', status.type);
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
    const anchorer = new Anchoring(api);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        //console.log('Transaction status:', status.type);
        if (status.isFinalized) {
          let anchor = await anchorer.findPreAnchor(ancParam.preAnchorParam.anchorId);
          expect(anchor.signingRoot).to.equal(ancParam.preAnchorParam.signingRoot);
          expect(anchor.identity).to.equal(u8aToHex(accMan.getAccountByIndex(0).publicKey));

          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.preCommit(ancParam.preAnchorParam)
            .signAndSend(accMan.getAccountByIndex(1), async ({ events = [], status }) => {
              //console.log('Transaction status:', status.type);
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
    const anchorer = new Anchoring(api);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        //console.log('Transaction status:', status.type);
        if (status.isFinalized) {
          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.commit(ancParam.anchorParam)
            .signAndSend(accMan.getAccountByIndex(0), async ({ events = [], status }) => {
              //console.log('Transaction status:', status.type);
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
    const anchorer = new Anchoring(api);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        //console.log('Transaction status:', status.type);
        if (status.isFinalized) {
          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.commit(ancParam.anchorParam)
            .signAndSend(accMan.getAccountByIndex(1), async ({ events = [], status }) => {
              //console.log('Transaction status:', status.type);
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
    api.disconnect();
  });

});