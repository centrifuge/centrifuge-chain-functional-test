import { expect } from "chai";
import "mocha";

import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { IKeyringPair } from "@polkadot/types/types";
import { u8aToHex } from "@polkadot/util";
import { Anchoring, AnchorParam } from "./anchoring";
import { senderFunction } from "./balance";
import { TestGlobals } from "./test_globals";
import { newRandomAnchorParams, newRandomCommitParam, callIfThrows } from "./testutil";

describe("Anchoring", () => {

  it("should commit anchor and not allow the same to be committed again", (done) => {
    const anchorer = new Anchoring(TestGlobals.connection);
    const ancParam = newRandomCommitParam();

    // const a = TestGlobals.accMan.getAccountByIndex(0);
    // const balance = await TestGlobals.connection.api.query.system.account(a.address);
    // console.log("Got balance for account", a.address, balance.toString());

    anchorer.commit(ancParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          const ancId = ancParam.getAnchorId();
          const anchor = await anchorer.findAnchor(ancId);
          callIfThrows(() => expect(anchor.docRoot.toHex()).to.equal(ancParam.docRoot), done)
          callIfThrows(() => expect(anchor.id.toHex()).to.equal(ancId), done);
          const evictionDate = await anchorer.findAnchorEvictionDate(ancId);
          callIfThrows(() => expect(ancParam.storedUntil).to.lte(evictionDate), done);

          // committing same anchor twice must FAIL
          anchorer.commit(ancParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events: evts = [], status: sts }) => {
              if (sts.isFinalized) {
                // find the anchored event
                evts.forEach(async ({ phase, event: { data, method, section } }) => {
                  if (section === "system") {
                    callIfThrows(() => expect(method).to.equal("ExtrinsicFailed"), done);
                    done();
                  }
                });
              }
            });
        }
      });
  });

  it("should pre-commit anchor and not allow to pre-commit the same before expiration", (done) => {
    const anchorer = new Anchoring(TestGlobals.connection);
    const ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preCommitParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          const anchor = await anchorer.findPreCommit(ancParam.preCommitParam.anchorId);
          callIfThrows(() => expect(anchor.signingRoot.toHex()).to.equal(ancParam.preCommitParam.signingRoot), done);
          callIfThrows(() => expect(anchor.identity.toHex()).to.equal(u8aToHex(TestGlobals.accMan.getAccountByIndex(0).publicKey)), done);

          // pre-committing same anchor before expiration of previous pre-commit must FAIL
          anchorer.preCommit(ancParam.preCommitParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(1), async ({ events: evts = [], status: sts }) => {
              if (sts.isFinalized) {
                evts.forEach(async ({ phase, event: { data, method, section } }) => {
                  if (section === "system") {
                    callIfThrows(() => expect(method).to.equal("ExtrinsicFailed"), done);
                    done();
                  }
                });
              } else if (sts.isDropped || sts.isInvalid || sts.isUsurped) {
                throw new Error(`Extrinsic 2 was ${sts.type} ${sts.value}, events: ${events}`);
              }
            });
        } else if (status.isDropped || status.isInvalid || status.isUsurped) {
          throw new Error(`Extrinsic was ${status.type} ${status.value}, events: ${events}`);
        }
      });
  });

  it("should pre-commit and then commit anchor with document proof", (done) => {
    const anchorer = new Anchoring(TestGlobals.connection);
    const ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preCommitParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          anchorer.commit(ancParam.anchorParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events: evts = [], status: sts }) => {
              if (sts.isFinalized) {
                const anchor = await anchorer.findAnchor(ancParam.anchorParam.getAnchorId());
                callIfThrows(() => expect(anchor.docRoot.toHex()).to.equal(ancParam.anchorParam.docRoot), done);
                callIfThrows(() => expect(anchor.id.toHex()).to.equal(ancParam.anchorParam.getAnchorId()), done);
                done();
              }
            });
        }
      });
  });

  it("should pre-commit and then commit anchor from another account must fail", (done) => {
    const anchorer = new Anchoring(TestGlobals.connection);
    const ancParam = newRandomAnchorParams();
    anchorer.preCommit(ancParam.preCommitParam)
      .signAndSend(TestGlobals.accMan.getAccountByIndex(0), async ({ events = [], status }) => {
        if (status.isFinalized) {
          anchorer.commit(ancParam.anchorParam)
            .signAndSend(TestGlobals.accMan.getAccountByIndex(1), async ({ events: evts = [], status: sts }) => {
              if (sts.isFinalized) {
                evts.forEach(async ({ phase, event: { data, method, section } }) => {
                  if (section === "system") {
                    callIfThrows(() => expect(method).to.equal("ExtrinsicFailed"), done);
                    done();
                  }
                });
              }
            });
        }
      });
  });


  it("should transfer balance correctly", async () => {
    const alice = TestGlobals.accMan.getAccountByIndex(0);
    const charlie = TestGlobals.accMan.getAccountByIndex(1);
    const testAcc = TestGlobals.accMan.getAccountByIndex(2);

    const { nonce: funderNonce } = await TestGlobals.connection.api.query.system.account(alice.address);

    try {
      await TestGlobals.connection.api.query.system.account(charlie.address);
      for (let i = 0; i < 5; i++) {
        const accInfo = await TestGlobals.connection.api.query.system.account(testAcc.address);
        console.log("Balance for account " + testAcc.address + ": " + accInfo.data.free);
        const start = new Date();
        await senderFunction(TestGlobals.connection.api, testAcc.address, alice, 100000, funderNonce);
        funderNonce.iaddn(1);
        const nthTxTime = new Date();
        console.log(i + "th tx time: ", nthTxTime.getTime() - start.getTime());
      }
    } catch (e) {
      console.log(e);
      throw e;
    }

  });
});
