import "./methods";
import {Ranking} from "../collection";


Ranking.rawCollection().createIndex({type:1, start:1, number:1, update:1})
Ranking.rawCollection().createIndex({user:1, type:1, start:1}, {unique:true})
