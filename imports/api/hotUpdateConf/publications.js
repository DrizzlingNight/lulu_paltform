import { Meteor } from 'meteor/meteor';
import { getList } from "./setting"
Meteor.publish('hotUpdate', function () {
    return getList();
});
