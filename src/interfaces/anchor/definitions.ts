export default {
    types: {
        PreCommitData: {
            signingRoot: 'Hash',
            identity: 'AccountId',
            expirationBlock: 'BlockNumber',
        },
        AnchorData: {
            id: 'Hash',
            docRoot: 'Hash',
            anchoredBlock: 'BlockNumber',
        },
    },
}