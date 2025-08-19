import { Events } from "../collections";

Events.rawCollection().createIndex("user");
Events.rawCollection().createIndex("eventType");
Events.rawCollection().createIndex("createdAt");