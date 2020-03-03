// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable @typescript-eslint/no-empty-interface */

import { AnyNumber } from '@polkadot/types/types';
import { Compact, Option, U8aFixed, Vec } from '@polkadot/types/codec';
import { Bytes, bool, u16, u32, u64 } from '@polkadot/types/primitive';
import { MemberCount, ProposalIndex } from '@polkadot/types/interfaces/collective';
import { Conviction, PropIndex, Proposal, ReferendumIndex } from '@polkadot/types/interfaces/democracy';
import { Vote } from '@polkadot/types/interfaces/elections';
import { Extrinsic, Signature } from '@polkadot/types/interfaces/extrinsics';
import { Heartbeat } from '@polkadot/types/interfaces/imOnline';
import { Proof } from 'centrifuge-chain/types/interfaces/proofs';
import { AccountId, AccountIndex, Address, Balance, BalanceOf, BlockNumber, Call, ChangesTrieConfiguration, H256, Hash, Header, KeyValue, LookupSource, Moment, Perbill } from '@polkadot/types/interfaces/runtime';
import { Keys } from '@polkadot/types/interfaces/session';
import { EraIndex, RewardDestination, ValidatorPrefs } from '@polkadot/types/interfaces/staking';
import { Key } from '@polkadot/types/interfaces/system';
import { Timepoint } from '@polkadot/types/interfaces/utility';
import { ApiTypes, SubmittableExtrinsic } from '@polkadot/api/types';

declare module '@polkadot/api/types/submittable' {
  export interface AugmentedSubmittables<ApiType> {
    system: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * A dispatch that will fill the block weight up to the given ratio.
       **/
      fillBlock: AugmentedSubmittable<(ratio: Perbill | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Make some on-chain remark.
       **/
      remark: AugmentedSubmittable<(remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Set the number of pages in the WebAssembly environment's heap.
       **/
      setHeapPages: AugmentedSubmittable<(pages: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Set the new runtime code.
       **/
      setCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Set the new runtime code without doing any checks of the given `code`.
       **/
      setCodeWithoutChecks: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Set the new changes trie configuration.
       **/
      setChangesTrieConfig: AugmentedSubmittable<(changesTrieConfig: Option<ChangesTrieConfiguration> | null | object | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Set some items of storage.
       **/
      setStorage: AugmentedSubmittable<(items: Vec<KeyValue> | (KeyValue)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Kill some items from storage.
       **/
      killStorage: AugmentedSubmittable<(keys: Vec<Key> | (Key | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Kill all storage items with a key that starts with the given prefix.
       **/
      killPrefix: AugmentedSubmittable<(prefix: Key | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Kill the sending account, assuming there are no references outstanding and the composite
       * data is equal to its default value.
       **/
      suicide: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
    };
    utility: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Send a batch of dispatch calls.
       * This will execute until the first one fails and then stop.
       * May be called from any origin.
       * - `calls`: The calls to be dispatched from the same origin.
       * # <weight>
       * - The sum of the weights of the `calls`.
       * - One event.
       * # </weight>
       * This will return `Ok` in all circumstances. To determine the success of the batch, an
       * event is deposited. If a call failed and the batch was interrupted, then the
       * `BatchInterrupted` event is deposited, along with the number of successful calls made
       * and the error of the failed call. If all were successful, then the `BatchCompleted`
       * event is deposited.
       **/
      batch: AugmentedSubmittable<(calls: Vec<Call> | (Call | { callIndex?: any; args?: any } | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Send a call through an indexed pseudonym of the sender.
       * The dispatch origin for this call must be _Signed_.
       * # <weight>
       * - The weight of the `call` + 10,000.
       * # </weight>
       **/
      asSub: AugmentedSubmittable<(index: u16 | AnyNumber | Uint8Array, call: Call | { callIndex?: any; args?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Register approval for a dispatch to be made from a deterministic composite account if
       * approved by a total of `threshold - 1` of `other_signatories`.
       * If there are enough, then dispatch the call.
       * Payment: `MultisigDepositBase` will be reserved if this is the first approval, plus
       * `threshold` times `MultisigDepositFactor`. It is returned once this dispatch happens or
       * is cancelled.
       * The dispatch origin for this call must be _Signed_.
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
       * not the first approval, then it must be `Some`, with the timepoint (block number and
       * transaction index) of the first approval transaction.
       * - `call`: The call to be executed.
       * NOTE: Unless this is the final approval, you will generally want to use
       * `approve_as_multi` instead, since it only requires a hash of the call.
       * Result is equivalent to the dispatched result if `threshold` is exactly `1`. Otherwise
       * on success, result is `Ok` and the result from the interior call, if it was executed,
       * may be found in the deposited `MultisigExecuted` event.
       * # <weight>
       * - `O(S + Z + Call)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - The weight of the `call`.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a
       * deposit taken for its lifetime of
       * `MultisigDepositBase + threshold * MultisigDepositFactor`.
       * # </weight>
       **/
      asMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId> | (AccountId | string | Uint8Array)[], maybeTimepoint: Option<Timepoint> | null | object | string | Uint8Array, call: Call | { callIndex?: any; args?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Register approval for a dispatch to be made from a deterministic composite account if
       * approved by a total of `threshold - 1` of `other_signatories`.
       * Payment: `MultisigDepositBase` will be reserved if this is the first approval, plus
       * `threshold` times `MultisigDepositFactor`. It is returned once this dispatch happens or
       * is cancelled.
       * The dispatch origin for this call must be _Signed_.
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be `None`. If it is
       * not the first approval, then it must be `Some`, with the timepoint (block number and
       * transaction index) of the first approval transaction.
       * - `call_hash`: The hash of the call to be executed.
       * NOTE: If this is the final approval, you will want to use `as_multi` instead.
       * # <weight>
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with a
       * deposit taken for its lifetime of
       * `MultisigDepositBase + threshold * MultisigDepositFactor`.
       * # </weight>
       **/
      approveAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId> | (AccountId | string | Uint8Array)[], maybeTimepoint: Option<Timepoint> | null | object | string | Uint8Array, callHash: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Cancel a pre-existing, on-going multisig transaction. Any deposit reserved previously
       * for this operation will be unreserved on success.
       * The dispatch origin for this call must be _Signed_.
       * - `threshold`: The total number of approvals for this dispatch before it is executed.
       * - `other_signatories`: The accounts (other than the sender) who can approve this
       * dispatch. May not be empty.
       * - `timepoint`: The timepoint (block number and transaction index) of the first approval
       * transaction for this dispatch.
       * - `call_hash`: The hash of the call to be executed.
       * # <weight>
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the number of
       * signatories. `S` is capped by `MaxSignatories`, with weight being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - One event.
       * - I/O: 1 read `O(S)`, one remove.
       * - Storage: removes one item.
       * # </weight>
       **/
      cancelAsMulti: AugmentedSubmittable<(threshold: u16 | AnyNumber | Uint8Array, otherSignatories: Vec<AccountId> | (AccountId | string | Uint8Array)[], timepoint: Timepoint | { height?: any; index?: any } | string | Uint8Array, callHash: U8aFixed | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    timestamp: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Set the current time.
       * This call should be invoked exactly once per block. It will panic at the finalization
       * phase, if this call hasn't been invoked by that time.
       * The timestamp should be greater than the previous one by the amount specified by
       * `MinimumPeriod`.
       * The dispatch origin for this call must be `Inherent`.
       **/
      set: AugmentedSubmittable<(now: Compact<Moment> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    authorship: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Provide a set of uncles.
       **/
      setUncles: AugmentedSubmittable<(newUncles: Vec<Header> | (Header | { parentHash?: any; number?: any; stateRoot?: any; extrinsicsRoot?: any; digest?: any } | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
    };
    indices: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Assign an previously unassigned index.
       * Payment: `Deposit` is reserved from the sender account.
       * The dispatch origin for this call must be _Signed_.
       * - `index`: the index to be claimed. This must not be in use.
       * Emits `IndexAssigned` if successful.
       * # <weight>
       * - `O(1)`.
       * - One storage mutation (codec `O(1)`).
       * - One reserve operation.
       * - One event.
       * # </weight>
       **/
      claim: AugmentedSubmittable<(index: AccountIndex | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Assign an index already owned by the sender to another account. The balance reservation
       * is effectively transferred to the new account.
       * The dispatch origin for this call must be _Signed_.
       * - `index`: the index to be re-assigned. This must be owned by the sender.
       * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
       * Emits `IndexAssigned` if successful.
       * # <weight>
       * - `O(1)`.
       * - One storage mutation (codec `O(1)`).
       * - One transfer operation.
       * - One event.
       * # </weight>
       **/
      transfer: AugmentedSubmittable<(updated: AccountId | string | Uint8Array, index: AccountIndex | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Free up an index owned by the sender.
       * Payment: Any previous deposit placed for the index is unreserved in the sender account.
       * The dispatch origin for this call must be _Signed_ and the sender must own the index.
       * - `index`: the index to be freed. This must be owned by the sender.
       * Emits `IndexFreed` if successful.
       * # <weight>
       * - `O(1)`.
       * - One storage mutation (codec `O(1)`).
       * - One reserve operation.
       * - One event.
       * # </weight>
       **/
      free: AugmentedSubmittable<(index: AccountIndex | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Force an index to an account. This doesn't require a deposit. If the index is already
       * held, then any deposit is reimbursed to its current owner.
       * The dispatch origin for this call must be _Root_.
       * - `index`: the index to be (re-)assigned.
       * - `new`: the new owner of the index. This function is a no-op if it is equal to sender.
       * Emits `IndexAssigned` if successful.
       * # <weight>
       * - `O(1)`.
       * - One storage mutation (codec `O(1)`).
       * - Up to one reserve operation.
       * - One event.
       * # </weight>
       **/
      forceTransfer: AugmentedSubmittable<(updated: AccountId | string | Uint8Array, index: AccountIndex | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    balances: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Transfer some liquid free balance to another account.
       * `transfer` will set the `FreeBalance` of the sender and receiver.
       * It will decrease the total issuance of the system by the `TransferFee`.
       * If the sender's account is below the existential deposit as a result
       * of the transfer, the account will be reaped.
       * The dispatch origin for this call must be `Signed` by the transactor.
       * # <weight>
       * - Dependent on arguments but not critical, given proper implementations for
       * input config types. See related functions below.
       * - It contains a limited number of reads and writes internally and no complex computation.
       * Related functions:
       * - `ensure_can_withdraw` is always called internally but has a bounded complexity.
       * - Transferring balances to accounts that did not exist before will cause
       * `T::OnNewAccount::on_new_account` to be called.
       * - Removing enough funds from an account will trigger `T::DustRemoval::on_unbalanced`.
       * - `transfer_keep_alive` works the same way as `transfer`, but has an additional
       * check that the transfer will not kill the origin account.
       * # </weight>
       **/
      transfer: AugmentedSubmittable<(dest: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array, value: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Set the balances of a given account.
       * This will alter `FreeBalance` and `ReservedBalance` in storage. it will
       * also decrease the total issuance of the system (`TotalIssuance`).
       * If the new free or reserved balance is below the existential deposit,
       * it will reset the account nonce (`frame_system::AccountNonce`).
       * The dispatch origin for this call is `root`.
       * # <weight>
       * - Independent of the arguments.
       * - Contains a limited number of reads and writes.
       * # </weight>
       **/
      setBalance: AugmentedSubmittable<(who: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array, newFree: Compact<Balance> | AnyNumber | Uint8Array, newReserved: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Exactly as `transfer`, except the origin must be root and the source account may be
       * specified.
       **/
      forceTransfer: AugmentedSubmittable<(source: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array, dest: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array, value: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Same as the [`transfer`] call, but with a check that the transfer will not kill the
       * origin account.
       * 99% of the time you want [`transfer`] instead.
       * [`transfer`]: struct.Module.html#method.transfer
       **/
      transferKeepAlive: AugmentedSubmittable<(dest: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array, value: Compact<Balance> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    staking: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Take the origin account as a stash and lock up `value` of its balance. `controller` will
       * be the account that controls it.
       * `value` must be more than the `minimum_balance` specified by `T::Currency`.
       * The dispatch origin for this call must be _Signed_ by the stash account.
       * # <weight>
       * - Independent of the arguments. Moderate complexity.
       * - O(1).
       * - Three extra DB entries.
       * NOTE: Two of the storage writes (`Self::bonded`, `Self::payee`) are _never_ cleaned unless
       * the `origin` falls below _existential deposit_ and gets removed as dust.
       * # </weight>
       **/
      bond: AugmentedSubmittable<(controller: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array, value: Compact<BalanceOf> | AnyNumber | Uint8Array, payee: RewardDestination | ('Staked' | 'Stash' | 'Controller') | number | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Add some extra amount that have appeared in the stash `free_balance` into the balance up
       * for staking.
       * Use this if there are additional funds in your stash account that you wish to bond.
       * Unlike [`bond`] or [`unbond`] this function does not impose any limitation on the amount
       * that can be added.
       * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
       * # <weight>
       * - Independent of the arguments. Insignificant complexity.
       * - O(1).
       * - One DB entry.
       * # </weight>
       **/
      bondExtra: AugmentedSubmittable<(maxAdditional: Compact<BalanceOf> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Schedule a portion of the stash to be unlocked ready for transfer out after the bond
       * period ends. If this leaves an amount actively bonded less than
       * T::Currency::minimum_balance(), then it is increased to the full amount.
       * Once the unlock period is done, you can call `withdraw_unbonded` to actually move
       * the funds out of management ready for transfer.
       * No more than a limited number of unlocking chunks (see `MAX_UNLOCKING_CHUNKS`)
       * can co-exists at the same time. In that case, [`Call::withdraw_unbonded`] need
       * to be called first to remove some of the chunks (if possible).
       * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
       * See also [`Call::withdraw_unbonded`].
       * # <weight>
       * - Independent of the arguments. Limited but potentially exploitable complexity.
       * - Contains a limited number of reads.
       * - Each call (requires the remainder of the bonded balance to be above `minimum_balance`)
       * will cause a new entry to be inserted into a vector (`Ledger.unlocking`) kept in storage.
       * The only way to clean the aforementioned storage item is also user-controlled via `withdraw_unbonded`.
       * - One DB entry.
       * </weight>
       **/
      unbond: AugmentedSubmittable<(value: Compact<BalanceOf> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Remove any unlocked chunks from the `unlocking` queue from our management.
       * This essentially frees up that balance to be used by the stash account to do
       * whatever it wants.
       * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
       * See also [`Call::unbond`].
       * # <weight>
       * - Could be dependent on the `origin` argument and how much `unlocking` chunks exist.
       * It implies `consolidate_unlocked` which loops over `Ledger.unlocking`, which is
       * indirectly user-controlled. See [`unbond`] for more detail.
       * - Contains a limited number of reads, yet the size of which could be large based on `ledger`.
       * - Writes are limited to the `origin` account key.
       * # </weight>
       **/
      withdrawUnbonded: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Declare the desire to validate for the origin controller.
       * Effects will be felt at the beginning of the next era.
       * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
       * # <weight>
       * - Independent of the arguments. Insignificant complexity.
       * - Contains a limited number of reads.
       * - Writes are limited to the `origin` account key.
       * # </weight>
       **/
      validate: AugmentedSubmittable<(prefs: ValidatorPrefs | { commission?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Declare the desire to nominate `targets` for the origin controller.
       * Effects will be felt at the beginning of the next era.
       * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
       * # <weight>
       * - The transaction's complexity is proportional to the size of `targets`,
       * which is capped at `MAX_NOMINATIONS`.
       * - Both the reads and writes follow a similar pattern.
       * # </weight>
       **/
      nominate: AugmentedSubmittable<(targets: Vec<LookupSource> | (LookupSource | Address | AccountId | AccountIndex | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Declare no desire to either validate or nominate.
       * Effects will be felt at the beginning of the next era.
       * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
       * # <weight>
       * - Independent of the arguments. Insignificant complexity.
       * - Contains one read.
       * - Writes are limited to the `origin` account key.
       * # </weight>
       **/
      chill: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * (Re-)set the payment target for a controller.
       * Effects will be felt at the beginning of the next era.
       * The dispatch origin for this call must be _Signed_ by the controller, not the stash.
       * # <weight>
       * - Independent of the arguments. Insignificant complexity.
       * - Contains a limited number of reads.
       * - Writes are limited to the `origin` account key.
       * # </weight>
       **/
      setPayee: AugmentedSubmittable<(payee: RewardDestination | ('Staked' | 'Stash' | 'Controller') | number | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * (Re-)set the controller of a stash.
       * Effects will be felt at the beginning of the next era.
       * The dispatch origin for this call must be _Signed_ by the stash, not the controller.
       * # <weight>
       * - Independent of the arguments. Insignificant complexity.
       * - Contains a limited number of reads.
       * - Writes are limited to the `origin` account key.
       * # </weight>
       **/
      setController: AugmentedSubmittable<(controller: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * The ideal number of validators.
       **/
      setValidatorCount: AugmentedSubmittable<(updated: Compact<u32> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Force there to be no new eras indefinitely.
       * # <weight>
       * - No arguments.
       * # </weight>
       **/
      forceNoEras: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Force there to be a new era at the end of the next session. After this, it will be
       * reset to normal (non-forced) behaviour.
       * # <weight>
       * - No arguments.
       * # </weight>
       **/
      forceNewEra: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Set the validators who cannot be slashed (if any).
       **/
      setInvulnerables: AugmentedSubmittable<(validators: Vec<AccountId> | (AccountId | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Force a current staker to become completely unstaked, immediately.
       **/
      forceUnstake: AugmentedSubmittable<(stash: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Force there to be a new era at the end of sessions indefinitely.
       * # <weight>
       * - One storage write
       * # </weight>
       **/
      forceNewEraAlways: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Cancel enactment of a deferred slash. Can be called by either the root origin or
       * the `T::SlashCancelOrigin`.
       * passing the era and indices of the slashes for that era to kill.
       * # <weight>
       * - One storage write.
       * # </weight>
       **/
      cancelDeferredSlash: AugmentedSubmittable<(era: EraIndex | AnyNumber | Uint8Array, slashIndices: Vec<u32> | (u32 | AnyNumber | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Rebond a portion of the stash scheduled to be unlocked.
       * # <weight>
       * - Time complexity: O(1). Bounded by `MAX_UNLOCKING_CHUNKS`.
       * - Storage changes: Can't increase storage, only decrease it.
       * # </weight>
       **/
      rebond: AugmentedSubmittable<(value: Compact<BalanceOf> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Remove all data structure concerning a staker/stash once its balance is zero.
       * This is essentially equivalent to `withdraw_unbonded` except it can be called by anyone
       * and the target `stash` must have no funds left.
       * This can be called from any origin.
       * - `stash`: The stash account to reap. Its balance must be zero.
       **/
      reapStash: AugmentedSubmittable<(stash: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    session: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Sets the session key(s) of the function caller to `keys`.
       * Allows an account to set its session key prior to becoming a validator.
       * This doesn't take effect until the next session.
       * The dispatch origin of this function must be signed.
       * # <weight>
       * - O(log n) in number of accounts.
       * - One extra DB entry.
       * - Increases system account refs by one on success iff there were previously no keys set.
       * In this case, purge_keys will need to be called before the account can be removed.
       * # </weight>
       **/
      setKeys: AugmentedSubmittable<(keys: Keys, proof: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Removes any session key(s) of the function caller.
       * This doesn't take effect until the next session.
       * The dispatch origin of this function must be signed.
       * # <weight>
       * - O(N) in number of key types.
       * - Removes N + 1 DB entries.
       * - Reduces system account refs by one on success.
       * # </weight>
       **/
      purgeKeys: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
    };
    democracy: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Propose a sensitive action to be taken.
       * # <weight>
       * - O(1).
       * - Two DB changes, one DB entry.
       * # </weight>
       **/
      propose: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array, value: Compact<BalanceOf> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Propose a sensitive action to be taken.
       * # <weight>
       * - O(1).
       * - One DB entry.
       * # </weight>
       **/
      second: AugmentedSubmittable<(proposal: Compact<PropIndex> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Vote in a referendum. If `vote.is_aye()`, the vote is to enact the proposal;
       * otherwise it is a vote to keep the status quo.
       * # <weight>
       * - O(1).
       * - One DB change, one DB entry.
       * # </weight>
       **/
      vote: AugmentedSubmittable<(refIndex: Compact<ReferendumIndex> | AnyNumber | Uint8Array, vote: Vote | { aye: boolean; conviction?: ('None' | 'Locked1x' | 'Locked2x' | 'Locked3x' | 'Locked4x' | 'Locked5x' | 'Locked6x') | number } | boolean | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Vote in a referendum on behalf of a stash. If `vote.is_aye()`, the vote is to enact
       * the proposal; otherwise it is a vote to keep the status quo.
       * # <weight>
       * - O(1).
       * - One DB change, one DB entry.
       * # </weight>
       **/
      proxyVote: AugmentedSubmittable<(refIndex: Compact<ReferendumIndex> | AnyNumber | Uint8Array, vote: Vote | { aye: boolean; conviction?: ('None' | 'Locked1x' | 'Locked2x' | 'Locked3x' | 'Locked4x' | 'Locked5x' | 'Locked6x') | number } | boolean | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Schedule an emergency cancellation of a referendum. Cannot happen twice to the same
       * referendum.
       **/
      emergencyCancel: AugmentedSubmittable<(refIndex: ReferendumIndex | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Schedule a referendum to be tabled once it is legal to schedule an external
       * referendum.
       **/
      externalPropose: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Schedule a majority-carries referendum to be tabled next once it is legal to schedule
       * an external referendum.
       * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
       * pre-scheduled `external_propose` call.
       **/
      externalProposeMajority: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Schedule a negative-turnout-bias referendum to be tabled next once it is legal to
       * schedule an external referendum.
       * Unlike `external_propose`, blacklisting has no effect on this and it may replace a
       * pre-scheduled `external_propose` call.
       **/
      externalProposeDefault: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Schedule the currently externally-proposed majority-carries referendum to be tabled
       * immediately. If there is no externally-proposed referendum currently, or if there is one
       * but it is not a majority-carries referendum then it fails.
       * - `proposal_hash`: The hash of the current external proposal.
       * - `voting_period`: The period that is allowed for voting on this proposal. Increased to
       * `EmergencyVotingPeriod` if too low.
       * - `delay`: The number of block after voting has ended in approval and this should be
       * enacted. This doesn't have a minimum amount.
       **/
      fastTrack: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array, votingPeriod: BlockNumber | AnyNumber | Uint8Array, delay: BlockNumber | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Veto and blacklist the external proposal hash.
       **/
      vetoExternal: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Remove a referendum.
       **/
      cancelReferendum: AugmentedSubmittable<(refIndex: Compact<ReferendumIndex> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Cancel a proposal queued for enactment.
       **/
      cancelQueued: AugmentedSubmittable<(which: ReferendumIndex | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Specify a proxy that is already open to us. Called by the stash.
       * NOTE: Used to be called `set_proxy`.
       * # <weight>
       * - One extra DB entry.
       * # </weight>
       **/
      activateProxy: AugmentedSubmittable<(proxy: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Clear the proxy. Called by the proxy.
       * NOTE: Used to be called `resign_proxy`.
       * # <weight>
       * - One DB clear.
       * # </weight>
       **/
      closeProxy: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Deactivate the proxy, but leave open to this account. Called by the stash.
       * The proxy must already be active.
       * NOTE: Used to be called `remove_proxy`.
       * # <weight>
       * - One DB clear.
       * # </weight>
       **/
      deactivateProxy: AugmentedSubmittable<(proxy: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Delegate vote.
       * # <weight>
       * - One extra DB entry.
       * # </weight>
       **/
      delegate: AugmentedSubmittable<(to: AccountId | string | Uint8Array, conviction: Conviction | ('None' | 'Locked1x' | 'Locked2x' | 'Locked3x' | 'Locked4x' | 'Locked5x' | 'Locked6x') | number | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Undelegate vote.
       * # <weight>
       * - O(1).
       * # </weight>
       **/
      undelegate: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Veto and blacklist the proposal hash. Must be from Root origin.
       **/
      clearPublicProposals: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Register the preimage for an upcoming proposal. This doesn't require the proposal to be
       * in the dispatch queue but does require a deposit, returned once enacted.
       **/
      notePreimage: AugmentedSubmittable<(encodedProposal: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Register the preimage for an upcoming proposal. This requires the proposal to be
       * in the dispatch queue. No deposit is needed.
       **/
      noteImminentPreimage: AugmentedSubmittable<(encodedProposal: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Remove an expired proposal preimage and collect the deposit.
       * This will only work after `VotingPeriod` blocks from the time that the preimage was
       * noted, if it's the same account doing it. If it's a different account, then it'll only
       * work an additional `EnactmentPeriod` later.
       **/
      reapPreimage: AugmentedSubmittable<(proposalHash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      unlock: AugmentedSubmittable<(target: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Become a proxy.
       * This must be called prior to a later `activate_proxy`.
       * Origin must be a Signed.
       * - `target`: The account whose votes will later be proxied.
       * `close_proxy` must be called before the account can be destroyed.
       * # <weight>
       * - One extra DB entry.
       * # </weight>
       **/
      openProxy: AugmentedSubmittable<(target: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    council: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Set the collective's membership manually to `new_members`. Be nice to the chain and
       * provide it pre-sorted.
       * Requires root origin.
       **/
      setMembers: AugmentedSubmittable<(newMembers: Vec<AccountId> | (AccountId | string | Uint8Array)[]) => SubmittableExtrinsic<ApiType>>;
      /**
       * Dispatch a proposal from a member using the `Member` origin.
       * Origin must be a member of the collective.
       **/
      execute: AugmentedSubmittable<(proposal: Proposal | { callIndex?: any; args?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * # <weight>
       * - Bounded storage reads and writes.
       * - Argument `threshold` has bearing on weight.
       * # </weight>
       **/
      propose: AugmentedSubmittable<(threshold: Compact<MemberCount> | AnyNumber | Uint8Array, proposal: Proposal | { callIndex?: any; args?: any } | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * # <weight>
       * - Bounded storage read and writes.
       * - Will be slightly heavier if the proposal is approved / disapproved after the vote.
       * # </weight>
       **/
      vote: AugmentedSubmittable<(proposal: Hash | string | Uint8Array, index: Compact<ProposalIndex> | AnyNumber | Uint8Array, approve: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    elections: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Vote for a set of candidates for the upcoming round of election.
       * The `votes` should:
       * - not be empty.
       * - be less than the number of candidates.
       * Upon voting, `value` units of `who`'s balance is locked and a bond amount is reserved.
       * It is the responsibility of the caller to not place all of their balance into the lock
       * and keep some for further transactions.
       * # <weight>
       * #### State
       * Reads: O(1)
       * Writes: O(V) given `V` votes. V is bounded by 16.
       * # </weight>
       **/
      vote: AugmentedSubmittable<(votes: Vec<AccountId> | (AccountId | string | Uint8Array)[], value: Compact<BalanceOf> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Remove `origin` as a voter. This removes the lock and returns the bond.
       * # <weight>
       * #### State
       * Reads: O(1)
       * Writes: O(1)
       * # </weight>
       **/
      removeVoter: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Report `target` for being an defunct voter. In case of a valid report, the reporter is
       * rewarded by the bond amount of `target`. Otherwise, the reporter itself is removed and
       * their bond is slashed.
       * A defunct voter is defined to be:
       * - a voter whose current submitted votes are all invalid. i.e. all of them are no
       * longer a candidate nor an active member.
       * # <weight>
       * #### State
       * Reads: O(NLogM) given M current candidates and N votes for `target`.
       * Writes: O(1)
       * # </weight>
       **/
      reportDefunctVoter: AugmentedSubmittable<(target: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Submit oneself for candidacy.
       * A candidate will either:
       * - Lose at the end of the term and forfeit their deposit.
       * - Win and become a member. Members will eventually get their stash back.
       * - Become a runner-up. Runners-ups are reserved members in case one gets forcefully
       * removed.
       * # <weight>
       * #### State
       * Reads: O(LogN) Given N candidates.
       * Writes: O(1)
       * # </weight>
       **/
      submitCandidacy: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Renounce one's intention to be a candidate for the next election round. 3 potential
       * outcomes exist:
       * - `origin` is a candidate and not elected in any set. In this case, the bond is
       * unreserved, returned and origin is removed as a candidate.
       * - `origin` is a current runner up. In this case, the bond is unreserved, returned and
       * origin is removed as a runner.
       * - `origin` is a current member. In this case, the bond is unreserved and origin is
       * removed as a member, consequently not being a candidate for the next round anymore.
       * Similar to [`remove_voter`], if replacement runners exists, they are immediately used.
       **/
      renounceCandidacy: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
      /**
       * Remove a particular member from the set. This is effective immediately and the bond of
       * the outgoing member is slashed.
       * If a runner-up is available, then the best runner-up will be removed and replaces the
       * outgoing member. Otherwise, a new phragmen round is started.
       * Note that this does not affect the designated block number of the next election.
       * # <weight>
       * #### State
       * Reads: O(do_phragmen)
       * Writes: O(do_phragmen)
       * # </weight>
       **/
      removeMember: AugmentedSubmittable<(who: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    finalityTracker: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Hint that the author of this block thinks the best finalized
       * block is the given number.
       **/
      finalHint: AugmentedSubmittable<(hint: Compact<BlockNumber> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    grandpa: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Report some misbehavior.
       **/
      reportMisbehavior: AugmentedSubmittable<(report: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    treasury: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Put forward a suggestion for spending. A deposit proportional to the value
       * is reserved and slashed if the proposal is rejected. It is returned once the
       * proposal is awarded.
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB change, one extra DB entry.
       * # </weight>
       **/
      proposeSpend: AugmentedSubmittable<(value: Compact<BalanceOf> | AnyNumber | Uint8Array, beneficiary: LookupSource | Address | AccountId | AccountIndex | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Reject a proposed spend. The original deposit will be slashed.
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB clear.
       * # </weight>
       **/
      rejectProposal: AugmentedSubmittable<(proposalId: Compact<ProposalIndex> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Approve a proposal. At a later time, the proposal will be allocated to the beneficiary
       * and the original deposit will be returned.
       * # <weight>
       * - O(1).
       * - Limited storage reads.
       * - One DB change.
       * # </weight>
       **/
      approveProposal: AugmentedSubmittable<(proposalId: Compact<ProposalIndex> | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Report something `reason` that deserves a tip and claim any eventual the finder's fee.
       * The dispatch origin for this call must be _Signed_.
       * Payment: `TipReportDepositBase` will be reserved from the origin account, as well as
       * `TipReportDepositPerByte` for each byte in `reason`.
       * - `reason`: The reason for, or the thing that deserves, the tip; generally this will be
       * a UTF-8-encoded URL.
       * - `who`: The account which should be credited for the tip.
       * Emits `NewTip` if successful.
       * # <weight>
       * - `O(R)` where `R` length of `reason`.
       * - One balance operation.
       * - One storage mutation (codec `O(R)`).
       * - One event.
       * # </weight>
       **/
      reportAwesome: AugmentedSubmittable<(reason: Bytes | string | Uint8Array, who: AccountId | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Retract a prior tip-report from `report_awesome`, and cancel the process of tipping.
       * If successful, the original deposit will be unreserved.
       * The dispatch origin for this call must be _Signed_ and the tip identified by `hash`
       * must have been reported by the signing account through `report_awesome` (and not
       * through `tip_new`).
       * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
       * as the hash of the tuple of the original tip `reason` and the beneficiary account ID.
       * Emits `TipRetracted` if successful.
       * # <weight>
       * - `O(T)`
       * - One balance operation.
       * - Two storage removals (one read, codec `O(T)`).
       * - One event.
       * # </weight>
       **/
      retractTip: AugmentedSubmittable<(hash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Give a tip for something new; no finder's fee will be taken.
       * The dispatch origin for this call must be _Signed_ and the signing account must be a
       * member of the `Tippers` set.
       * - `reason`: The reason for, or the thing that deserves, the tip; generally this will be
       * a UTF-8-encoded URL.
       * - `who`: The account which should be credited for the tip.
       * - `tip_value`: The amount of tip that the sender would like to give. The median tip
       * value of active tippers will be given to the `who`.
       * Emits `NewTip` if successful.
       * # <weight>
       * - `O(R + T)` where `R` length of `reason`, `T` is the number of tippers. `T` is
       * naturally capped as a membership set, `R` is limited through transaction-size.
       * - Two storage insertions (codecs `O(R)`, `O(T)`), one read `O(1)`.
       * - One event.
       * # </weight>
       **/
      tipNew: AugmentedSubmittable<(reason: Bytes | string | Uint8Array, who: AccountId | string | Uint8Array, tipValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Declare a tip value for an already-open tip.
       * The dispatch origin for this call must be _Signed_ and the signing account must be a
       * member of the `Tippers` set.
       * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
       * as the hash of the tuple of the hash of the original tip `reason` and the beneficiary
       * account ID.
       * - `tip_value`: The amount of tip that the sender would like to give. The median tip
       * value of active tippers will be given to the `who`.
       * Emits `TipClosing` if the threshold of tippers has been reached and the countdown period
       * has started.
       * # <weight>
       * - `O(T)`
       * - One storage mutation (codec `O(T)`), one storage read `O(1)`.
       * - Up to one event.
       * # </weight>
       **/
      tip: AugmentedSubmittable<(hash: Hash | string | Uint8Array, tipValue: BalanceOf | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Close and payout a tip.
       * The dispatch origin for this call must be _Signed_.
       * The tip identified by `hash` must have finished its countdown period.
       * - `hash`: The identity of the open tip for which a tip value is declared. This is formed
       * as the hash of the tuple of the original tip `reason` and the beneficiary account ID.
       * # <weight>
       * - `O(T)`
       * - One storage retrieval (codec `O(T)`) and two removals.
       * - Up to three balance operations.
       * # </weight>
       **/
      closeTip: AugmentedSubmittable<(hash: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    imOnline: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      heartbeat: AugmentedSubmittable<(heartbeat: Heartbeat | { blockNumber?: any; networkState?: any; sessionIndex?: any; authorityIndex?: any } | string | Uint8Array, signature: Signature | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    anchor: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Obtains an exclusive lock to make the next update to a certain document version
       * identified by `anchor_id` on Centrifuge p2p network for a number of blocks given
       * by `pre_commit_expiration_duration_blocks` function. `signing_root` is a child node of
       * the off-chain merkle tree of that document. In Centrifuge protocol, A document is
       * committed only after reaching consensus with the other collaborators on the document.
       * Consensus is reached by getting a cryptographic signature from other parties by
       * sending them the `signing_root`. To deny the counter-party the free option of publishing
       * its own state commitment upon receiving a request for signature, the node can first
       * publish a pre-commit. Only the pre-committer account in the Centrifuge chain is
       * allowed to `commit` a corresponding anchor before the pre-commit has expired.
       * For a more detailed explanation refer section 3.4 of
       * [Centrifuge Protocol Paper](https://staticw.centrifuge.io/assets/centrifuge_os_protocol_paper.pdf)
       * # <weight>
       * minimal logic, also needs to be consume less block capacity + cheaper to make the pre-commits viable.
       * # </weight>
       **/
      preCommit: AugmentedSubmittable<(anchorId: Hash | string | Uint8Array, signingRoot: Hash | string | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Commits a `document_root` of a merklized off chain document in Centrifuge p2p network as
       * the latest version id(`anchor_id`) obtained by hashing `anchor_id_preimage`. If a
       * pre-commit exists for the obtained `anchor_id`, hash of pre-committed
       * `signing_root + proof` must match the given `doc_root`. To avoid state bloat on chain,
       * the committed anchor would be evicted after the given `stored_until_date`. The calling
       * account would be charged accordingly for the storage period.
       * For a more detailed explanation refer section 3.4 of
       * [Centrifuge Protocol Paper](https://staticw.centrifuge.io/assets/centrifuge_os_protocol_paper.pdf)
       * # <weight>
       * State rent takes into account the storage cost depending on `stored_until_date`.
       * Otherwise independant of the inputs. The weight cost is important as it helps avoid DOS
       * using smaller `stored_until_date`s. Computation cost involves timestamp calculations
       * and state rent calculations, which we take here to be equivalent to a transfer transaction.
       * # </weight>
       **/
      commit: AugmentedSubmittable<(anchorIdPreimage: Hash | string | Uint8Array, docRoot: Hash | string | Uint8Array, proof: Hash | string | Uint8Array, storedUntilDate: Moment | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Initiates eviction of pre-commits that has expired given that the current block number
       * has progressed past the block number provided in `evict_bucket`. `evict_bucket` is also
       * the index to find the pre-commits stored in storage to be evicted when the
       * `evict_bucket` number of blocks has expired.
       * # <weight>
       * - discourage DoS
       * # </weight>
       **/
      evictPreCommits: AugmentedSubmittable<(evictBucket: BlockNumber | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
      /**
       * Initiates eviction of expired anchors. Since anchors are stored on a child trie indexed by
       * their eviction date, what this function does is to remove those child tries which has
       * date_represented_by_root < current_date. Additionally it needs to take care of indexes
       * created for accessing anchors, eg: to find an anchor given an id.
       * # <weight>
       * - discourage DoS
       * # </weight>
       **/
      evictAnchors: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>>;
    };
    fees: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Set the given fee for the key
       * # <weight>
       * - Independent of the arguments.
       * - Contains a limited number of reads and writes.
       * # </weight>
       **/
      setFee: AugmentedSubmittable<(key: Hash | string | Uint8Array, newPrice: Balance | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>>;
    };
    nfts: {
      [index: string]: SubmittableExtrinsicFunction<ApiType>;
      /**
       * Validates the proofs provided against the document root associated with the anchor_id.
       * Once the proofs are verified, we create a bundled hash (deposit_address + [proof[i].hash])
       * Bundled Hash is deposited to an DepositAsset event for bridging purposes.
       * # <weight>
       * - depends on the arguments
       * # </weight>
       **/
      validateMint: AugmentedSubmittable<(anchorId: Hash | string | Uint8Array, depositAddress: U8aFixed | string | Uint8Array, pfs: Vec<Proof> | (Proof | { leafHash?: any; sortedHashes?: any } | string | Uint8Array)[], staticProofs: Vec<H256>) => SubmittableExtrinsic<ApiType>>;
    };
  }

  export interface SubmittableExtrinsics<ApiType extends ApiTypes> extends AugmentedSubmittables<ApiType> {
    (extrinsic: Call | Extrinsic | Uint8Array | string): SubmittableExtrinsic<ApiType>;
    [index: string]: SubmittableModuleExtrinsics<ApiType>;
  }
}
