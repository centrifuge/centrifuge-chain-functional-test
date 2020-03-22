import { expect } from "chai";
import "mocha";

import { TestGlobals } from "./test_globals";

describe("Metadata", () => {
  it("should list out all public calls in the system", async () => {
      const extrinsics = [];
      let count = 0;
      Object.keys(TestGlobals.connection.api.tx).forEach((mod) => {
        Object.keys(TestGlobals.connection.api.tx[mod]).forEach((call) => {
            extrinsics.push(mod + "." + call);
            // printing for documentation
            console.log("|" + count + "|", mod, "|", call, "|-|");
            count++;
        });
      });
      expect(count).to.equal(89);
      // dummy check
      expect(extrinsics.length).to.equal(count);
  });
});
