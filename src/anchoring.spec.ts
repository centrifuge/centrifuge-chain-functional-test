import 'mocha';
import { expect } from 'chai';

import { Anchoring, AnchorParam } from './anchoring';
import { TestGlobals } from './test_globals';
import { newRandomCommitParam, newRandomAnchorParams } from './testutil';
import { u8aToHex } from '@polkadot/util';
import { IKeyringPair } from '@polkadot/types/types';
import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

describe('Anchoring', () => {

  it('should commit anchor and not allow the same to be committed again', (cb) => {
    const anchorer = new Anchoring(TestGlobals.connection);
    let ancParam = newRandomCommitParam();
    anchorer.commit(ancParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          let ancId = ancParam.getAnchorId();
          let anchor = await anchorer.findAnchor(ancId);
          expect(anchor.docRoot).to.equal(ancParam.docRoot);
          expect(anchor.id).to.equal(ancId);
          let evictionDate = await anchorer.findAnchorEvictionDate(ancId);
          expect(ancParam.storedUntil.getUTCDay()).to.lte(evictionDate.getUTCDay());
          expect(ancParam.storedUntil.getUTCMonth()).to.lte(evictionDate.getUTCMonth());
          expect(ancParam.storedUntil.getUTCFullYear()).to.lte(evictionDate.getUTCFullYear());

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
    const anchorer = new Anchoring(TestGlobals.connection);
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
    const anchorer = new Anchoring(TestGlobals.connection);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
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
    const anchorer = new Anchoring(TestGlobals.connection);
    let ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preAnchorParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
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

  xit('should transfer balance correctly', async () => {
    let keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const charlie = keyring.addFromUri('//Charlie');
    const testAcc = keyring.addFromUri('//TestAcc');
    console.log(testAcc.address);

    let funderNonce = await TestGlobals.connection.api.query.system.accountNonce(alice.address);
    let funderNonceRaw = +funderNonce.toString();

    try {
      const accBalance = await TestGlobals.connection.api.query.balances.freeBalance(charlie.address);
      for (let i = 0; i < 5; i++) {
        const testAcc = keyring.addFromUri('//TestAcc' + i);
        const accBalance = await TestGlobals.connection.api.query.balances.freeBalance(testAcc.address);
        console.log(testAcc.address);
        let start = new Date();
        let res = await senderFunction(TestGlobals.connection.api, testAcc.address, alice, 100000, funderNonceRaw);
        //console.log(res);
        funderNonceRaw++;
        let firstTxTime = new Date();
        console.log(i + "th tx time: ", firstTxTime.getTime() - start.getTime());
      }
    } catch(e) {
      console.log(e);
      throw e;
    }
    
  })
});


function senderFunction(api: ApiPromise, receiver: string, sender: IKeyringPair, value: number, nonce: number): Promise<any> {
  return new Promise<any>((resolve: Function, reject: Function) => {
    api.tx.balances.transfer(receiver, value).sign(sender, { nonce: nonce })
      .send(({ events = [], status }) => {
        console.log('Transaction status:', status.type);
  
        if (status.isFinalized) {
          console.log('Completed at block hash', status.asFinalized.toHex());
          console.log('Events:');
  
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
          });

          resolve(events);

          //cb();
  
          //process.exit(0);
        }
      });
  })
}