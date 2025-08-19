import {
    NonFungibleTokenItem,
    NonFungibleTokenPool,
} from "../collections";
import "./methods";

NonFungibleTokenPool.rawCollection().createIndex({active: 1})
NonFungibleTokenItem.rawCollection().createIndex({'state.idOnChain': 1}, {sparse: true, unique: true})
NonFungibleTokenItem.rawCollection().createIndex({_id:1, user:1}, {background: true})
NonFungibleTokenItem.rawCollection().createIndex({_id:1, user:1, disable:1}, {background: true})
