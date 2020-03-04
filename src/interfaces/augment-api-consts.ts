// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable @typescript-eslint/no-empty-interface */

import { Codec } from '@polkadot/types/types';
import { Bytes, u32, u64 } from '@polkadot/types/primitive';
import { Balance, BalanceOf, BlockNumber, Moment, Percent, Permill } from '@polkadot/types/interfaces/runtime';
import { SessionIndex } from '@polkadot/types/interfaces/session';
import { EraIndex } from '@polkadot/types/interfaces/staking';

declare module '@polkadot/metadata/Decorated/consts/types' {
  export interface Constants {
    [index: string]: ModuleConstants;
    babe: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * The number of **slots** that an epoch takes. We couple sessions to
       * epochs, i.e. we start a new session once the new epoch begins.
       **/
      epochDuration: AugmentedConst<u64>;
      /**
       * The expected average block time at which BABE should be creating
       * blocks. Since BABE is probabilistic it is not trivial to figure out
       * what the expected average block time should be based on the slot
       * duration and the security parameter `c` (where `1 - c` represents
       * the probability of a slot being empty).
       **/
      expectedBlockTime: AugmentedConst<Moment>;
    };
    timestamp: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * The minimum period between blocks. Beware that this is different to the *expected* period
       * that the block production apparatus provides. Your chosen consensus system will generally
       * work with this to determine a sensible block time. e.g. For Aura, it will be double this
       * period on default settings.
       **/
      minimumPeriod: AugmentedConst<Moment>;
    };
    balances: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * The minimum amount required to keep an account open.
       **/
      existentialDeposit: AugmentedConst<Balance>;
    };
    transactionPayment: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * The fee to be paid for making a transaction; the base.
       **/
      transactionBaseFee: AugmentedConst<BalanceOf>;
      /**
       * The fee to be paid for making a transaction; the per-byte portion.
       **/
      transactionByteFee: AugmentedConst<BalanceOf>;
    };
    staking: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * Number of sessions per era.
       **/
      sessionsPerEra: AugmentedConst<SessionIndex>;
      /**
       * Number of eras that staked funds must remain bonded for.
       **/
      bondingDuration: AugmentedConst<EraIndex>;
    };
    session: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * Used as first key for `NextKeys` and `KeyOwner` to put all the data into the same branch
       * of the trie.
       **/
      dedupKeyPrefix: AugmentedConst<Bytes>;
    };
    democracy: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * The minimum period of locking and the period between a proposal being approved and enacted.
       * It should generally be a little more than the unstake period to ensure that
       * voting stakers have an opportunity to remove themselves from the system in the case where
       * they are on the losing side of a vote.
       **/
      enactmentPeriod: AugmentedConst<BlockNumber>;
      /**
       * How often (in blocks) new public referenda are launched.
       **/
      launchPeriod: AugmentedConst<BlockNumber>;
      /**
       * How often (in blocks) to check for new votes.
       **/
      votingPeriod: AugmentedConst<BlockNumber>;
      /**
       * The minimum amount to be used as a deposit for a public referendum proposal.
       **/
      minimumDeposit: AugmentedConst<BalanceOf>;
      /**
       * Minimum voting period allowed for an emergency referendum.
       **/
      emergencyVotingPeriod: AugmentedConst<BlockNumber>;
      /**
       * Period in blocks where an external proposal may not be re-submitted after being vetoed.
       **/
      cooloffPeriod: AugmentedConst<BlockNumber>;
      /**
       * The amount of balance that must be deposited per byte of preimage stored.
       **/
      preimageByteDeposit: AugmentedConst<BalanceOf>;
    };
    elections: {
      [index: string]: AugmentedConst<object & Codec>;
      candidacyBond: AugmentedConst<BalanceOf>;
      votingBond: AugmentedConst<BalanceOf>;
      desiredMembers: AugmentedConst<u32>;
      desiredRunnersUp: AugmentedConst<u32>;
      termDuration: AugmentedConst<BlockNumber>;
    };
    finalityTracker: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * The number of recent samples to keep from this chain. Default is 101.
       **/
      windowSize: AugmentedConst<BlockNumber>;
      /**
       * The delay after which point things become suspicious. Default is 1000.
       **/
      reportLatency: AugmentedConst<BlockNumber>;
    };
    treasury: {
      [index: string]: AugmentedConst<object & Codec>;
      /**
       * Fraction of a proposal's value that should be bonded in order to place the proposal.
       * An accepted proposal gets these back. A rejected proposal does not.
       **/
      proposalBond: AugmentedConst<Permill>;
      /**
       * Minimum amount of funds that should be placed in a deposit for making a proposal.
       **/
      proposalBondMinimum: AugmentedConst<BalanceOf>;
      /**
       * Period between successive spends.
       **/
      spendPeriod: AugmentedConst<BlockNumber>;
      /**
       * Percentage of spare funds (if any) that are burnt per spend period.
       **/
      burn: AugmentedConst<Permill>;
      /**
       * The period for which a tip remains open after is has achieved threshold tippers.
       **/
      tipCountdown: AugmentedConst<BlockNumber>;
      /**
       * The amount of the final tip which goes to the original reporter of the tip.
       **/
      tipFindersFee: AugmentedConst<Percent>;
      /**
       * The amount held on deposit for placing a tip report.
       **/
      tipReportDepositBase: AugmentedConst<BalanceOf>;
      /**
       * The amount held on deposit per byte within the tip report reason.
       **/
      tipReportDepositPerByte: AugmentedConst<BalanceOf>;
    };
  }
}
