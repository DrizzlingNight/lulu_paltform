import {EJSON} from "meteor/ejson";
import {MongoInternals} from "meteor/mongo";
import {Decimal} from 'meteor/mongo-decimal';

if(Meteor.isServer) {
    const Decimal128 = MongoInternals.NpmModules.mongodb.module.Decimal128;
    Decimal128.prototype.typeName = function() {
        return "Decimal128";
    };
    Decimal128.prototype.toJSONValue = function() {
        return this.toString();
    };
    EJSON.addType("Decimal128", function fromJSONValue(json) {
        return Decimal128.fromString(json);
    });
}

if(Meteor.isClient) {
    EJSON.addType("Decimal128", function fromJSONValue(json) {
        return Decimal(json);
    });
}
