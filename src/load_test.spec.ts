import { expect } from "chai";
import "mocha";

import { KeyringPair } from "@polkadot/keyring/types";
import BN = require("bn.js");
import { Anchoring } from "./anchoring";
import { senderFunction } from "./balance";
import { TestGlobals } from "./test_globals";
import { newRandomAnchorParams } from "./testutil";

interface ISender {
  keypair: KeyringPair;
  nonce: BN;
}

describe.only("Load tests", () => {
  it("should send many txs in parallel and print aggregated statistics", async () => {
    const sender: ISender = { keypair: TestGlobals.accMan.getAccountByIndex(0), nonce: new BN(0) };
    sender.nonce = await TestGlobals.connection.api.query.system.accountNonce(sender.keypair.address) as any;

    const transfs = await sendBalanceTransfs(sender, 0);
    const preComms = await sendAnchorPreCommits(sender, 500);

    while (true) {
      const transfsStopped = transfs.filter((t) => t.stopAt !== null);
      const preCommsStopped = preComms.filter((t) => t.stopAt !== null);

      console.log(`balance_transfers: ` +
        `pending: ${transfs.filter((t) => t.status === "pending").length} | ` +
        `future: ${transfs.filter((t) => t.status === "future").length} | ` +
        `ready: ${transfs.filter((t) => t.status === "ready").length} | ` +
        `finalized: ${transfs.filter((t) => t.status === "finalized").length} | ` +
        `usurped: ${transfs.filter((t) => t.status === "usurped").length} | ` +
        `broadcast: ${transfs.filter((t) => t.status === "broadcast").length} | ` +
        `dropped: ${transfs.filter((t) => t.status === "dropped").length} | ` +
        `invalid: ${transfs.filter((t) => t.status === "invalid").length} || ` +
        `avgMs: ${transfsStopped.reduce((sum, t) => sum + t.stopAt! - t.startAt, 0) / transfsStopped.length}`);

      console.log(`anchor_preCommits: ` +
        `pending: ${preComms.filter((t) => t.status === "pending").length} | ` +
        `future: ${preComms.filter((t) => t.status === "future").length} | ` +
        `ready: ${preComms.filter((t) => t.status === "ready").length} | ` +
        `finalized: ${preComms.filter((t) => t.status === "finalized").length} | ` +
        `usurped: ${preComms.filter((t) => t.status === "usurped").length} | ` +
        `broadcast: ${preComms.filter((t) => t.status === "broadcast").length} | ` +
        `dropped: ${preComms.filter((t) => t.status === "dropped").length} | ` +
        `invalid: ${preComms.filter((t) => t.status === "invalid").length} || ` +
        `avgMs: ${preCommsStopped.reduce((sum, t) => sum + t.stopAt! - t.startAt, 0) / preCommsStopped.length}`);

      await sleep(1000);
    }
  });
});

interface IExt {
  i: number;
  startAt: number;
  stopAt: number|null;
  status: "pending"|"future"|"ready"|"finalized"|"usurped"|"broadcast"|"dropped"|"invalid";
}

async function sendBalanceTransfs(sender: ISender, n: number): Promise<IExt[]> {
  const transfers: IExt[] = [];
  // const senderBalance = await TestGlobals.connection.api.query.balances.freeBalance(sender.keypair.address);
  // console.log("Balance for account " + sender.keypair.address + ": " + senderBalance);
  const charlie = TestGlobals.accMan.getAccountByIndex(2);

  for (let i = 0; i < n; i++) {
    const transfer: IExt = {
      i,
      startAt: Date.now(),
      status: "pending",
      stopAt: null,
    };

    TestGlobals.connection.api.tx.balances.transfer(charlie.address, 1000).sign(sender.keypair, { nonce: sender.nonce })
      .send(({ events = [], status }) => {
        // console.log("Transaction status:", status.type);

        if (status.isFuture) {
          transfer.status = "future";
        } else if (status.isReady) {
          transfer.status = "ready";
        } else if (status.isFinalized) {
          transfer.status = "finalized";

          transfer.stopAt = Date.now();
          // console.log("Completed at block hash", status.asFinalized.toHex());
          // console.log("Events:");
          // events.forEach(({ phase, event: { data, method, section } }) => {
          //   console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
          // });
        } else if (status.isUsurped) {
          transfer.status = "usurped";
        } else if (status.isBroadcast) {
          transfer.status = "broadcast";
        } else if (status.isDropped) {
          transfer.status = "dropped";
          transfer.stopAt = Date.now();
        } else if (status.isInvalid) {
            transfer.status = "invalid";
            transfer.stopAt = Date.now();
        } else {
          throw new Error(`unexpected status ${status}`);
        }
    });

    transfers.push(transfer);

    // update nonce
    sender.nonce.iaddn(1);
  }

  return transfers;
}

async function sendAnchorPreCommits(sender: ISender, n: number): Promise<IExt[]> {
  const anchors: IExt[] = [];

  const anchorer = new Anchoring(TestGlobals.connection);

  for (let i = 0; i < n; i++) {
    const ancParam = newRandomAnchorParams();

    const anchor: IExt = {
      i,
      startAt: Date.now(),
      status: "pending",
      stopAt: null,
    };

    anchorer.preCommit(ancParam.preCommitParam)
      .signAndSend(sender.keypair, { nonce: sender.nonce }, async ({ events = [], status }) => {
        // console.log("Transaction status:", status.type);

        if (status.isFuture) {
          anchor.status = "future";
        } else if (status.isReady) {
          anchor.status = "ready";
        } else if (status.isFinalized) {
          anchor.status = "finalized";

          anchor.stopAt = Date.now();
          // console.log("Completed at block hash", status.asFinalized.toHex());
          // console.log("Events:");
          // events.forEach(({ phase, event: { data, method, section } }) => {
          //   console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
          // });
        } else if (status.isUsurped) {
          anchor.status = "usurped";
        } else if (status.isBroadcast) {
          anchor.status = "broadcast";
        } else if (status.isDropped) {
          anchor.status = "dropped";
          anchor.stopAt = Date.now();
        } else if (status.isInvalid) {
            anchor.status = "invalid";
            anchor.stopAt = Date.now();
        } else {
          throw new Error(`unexpected status ${status}`);
        }
      });

    anchors.push(anchor);

    // update nonce
    sender.nonce.iaddn(1);
  }

  return anchors;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
