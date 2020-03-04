import { ApiPromise } from "@polkadot/api";
import { IKeyringPair } from "@polkadot/types/types";
import BN from "bn.js";

export function senderFunction(
    api: ApiPromise, receiver: string, sender: IKeyringPair, value: number, nonce: BN|number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        try {
            api.tx.balances.transfer(receiver, value).sign(sender, { nonce })
                .send(({ events = [], status }) => {
                console.log("Transaction status:", status.type);

                if (status.isFinalized) {
                    console.log("Completed at block hash", status.asFinalized.toHex());
                    console.log("Events:");

                    events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log("\t", phase.toString(), `: ${section}.${method}`, data.toString());
                    });

                    resolve(events);

                    // cb();

                    // process.exit(0);
                }
            });
        } catch (e) {
            reject(e)
        }
    });
}
