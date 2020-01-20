import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { KeyringPair } from "@polkadot/keyring/types";
import BN = require("bn.js");
import { Anchoring } from "./anchoring";
import { TestGlobals } from "./test_globals";
import { newRandomAnchorParams } from "./testutil";

interface ISender {
  keypair: KeyringPair;
  nonce: BN;
}

describe("Load tests", () => {
  it("should send many txs in parallel and print aggregated statistics", async () => {
    const sender: ISender = { keypair: TestGlobals.accMan.getAccountByIndex(0), nonce: new BN(0) };
    sender.nonce = await TestGlobals.connection.api.query.system.accountNonce(sender.keypair.address) as any;

    const subs: SubmittableExtrinsic[] = [];

    // make sure not to use more than a total of 512 xts, ready pool has a limit of 512.
    addBalanceTransfs(subs, 170);
    addAchorPrecomms(subs, 170);
    addAchorComms(subs, 170);

    shuffle(subs);

    const exts = await signAndSend(sender, subs);

    for (let i = 0; i < 50; i++) {
      const stopped = exts.filter((t) => t.stopAt !== null);
      const finalized = exts.filter((t) => t.status === "finalized");

      console.log(`extrinsics: ` +
        `pending: ${exts.filter((t) => t.status === "pending").length} | ` +
        `future: ${exts.filter((t) => t.status === "future").length} | ` +
        `ready: ${exts.filter((t) => t.status === "ready").length} | ` +
        `finalized: ${finalized.length} | ` +
        `usurped: ${exts.filter((t) => t.status === "usurped").length} | ` +
        `broadcast: ${exts.filter((t) => t.status === "broadcast").length} | ` +
        `dropped: ${exts.filter((t) => t.status === "dropped").length} | ` +
        `invalid: ${exts.filter((t) => t.status === "invalid").length} || ` +
        `avgMs: ${stopped.length && stopped.reduce((sum, t) => sum + t.stopAt! - t.startAt, 0) / stopped.length}`);

      if (finalized.length === exts.length) {
        return;
      }

      await sleep(1000);
    }

    throw new Error("did not finalize all extrinsics in given time");
  });
});

interface IExt {
  startAt: number;
  stopAt: number | null;
  status: "pending" | "future" | "ready" | "finalized" | "usurped" | "broadcast" | "dropped" | "invalid";
}

function addBalanceTransfs(subs: SubmittableExtrinsic[], n: number) {
  const charlie = TestGlobals.accMan.getAccountByIndex(2);

  for (let i = 0; i < n; i++) {
    subs.push(TestGlobals.connection.api.tx.balances.transfer(charlie.address, 1000));
  }
}

function addAchorPrecomms(subs: SubmittableExtrinsic[], n: number) {
  const anchorer = new Anchoring(TestGlobals.connection);

  for (let i = 0; i < n; i++) {
    const ancParam = newRandomAnchorParams();
    subs.push(anchorer.preCommit(ancParam.preCommitParam));
  }
}

function addAchorComms(subs: SubmittableExtrinsic[], n: number) {
  const anchorer = new Anchoring(TestGlobals.connection);

  for (let i = 0; i < n; i++) {
    const ancParam = newRandomAnchorParams();
    subs.push(anchorer.commit(ancParam.anchorParam));
  }
}

async function signAndSend(sender: ISender, subs: SubmittableExtrinsic[]) {
  const exts: IExt[] = [];
  // const senderBalance = await TestGlobals.connection.api.query.balances.freeBalance(sender.keypair.address);
  // console.log("Balance for account " + sender.keypair.address + ": " + senderBalance);

  for (const sub of subs) {

    const ext: IExt = {
      startAt: Date.now(),
      status: "pending",
      stopAt: null,
    };

    sub.sign(sender.keypair, { nonce: sender.nonce })
      .send(({ events = [], status }) => {
        // console.log("Transaction status:", status.type);

        if (status.isFuture) {
          ext.status = "future";
        } else if (status.isReady) {
          ext.status = "ready";
        } else if (status.isFinalized) {
          ext.status = "finalized";

          ext.stopAt = Date.now();
          // console.log("Completed at block hash", status.asFinalized.toHex());
          // console.log("Events:");
          // events.forEach(({ phase, event: { data, method, section } }) => {
          //   console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
          // });
        } else if (status.isUsurped) {
          ext.status = "usurped";
        } else if (status.isBroadcast) {
          ext.status = "broadcast";
        } else if (status.isDropped) {
          ext.status = "dropped";
          ext.stopAt = Date.now();
        } else if (status.isInvalid) {
          ext.status = "invalid";
          ext.stopAt = Date.now();
        } else {
          throw new Error(`unexpected status ${status}`);
        }
      });

    exts.push(ext);

    // update nonce
    sender.nonce.iaddn(1);
  }

  return exts;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
