import SimpleSchema from "simpl-schema";
import {BaseSchema} from "../../core/schema";
import {Collection} from "../../core/database";
import {Enum} from "../../../utils/enum";

const ArticleBagSchema = new SimpleSchema({
    _id: String,
    articleId:Number,
    number: Number,
    user: String,
});
ArticleBagSchema.extend(BaseSchema);
const ArticleBag = new Collection("articleBag");
ArticleBag.attachSchema(ArticleBagSchema);

const ArticalType = new Enum({
    Goods: "goods",
    Seed: "seed",
    Fruit: "fruit",
    Fragment: "fragment",
    Key: "key",
})

const ArticleSchema = new SimpleSchema({
    _id: Number,
    type:ArticalType,
    linkedId: String,
    name: Object,
    des: Object,
    converTo: String,
    numConvert: Number,
});
ArticleSchema.extend(BaseSchema);

const Article = new Collection("article");
Article.attachSchema(ArticleSchema);

const ArticleRecordType = new Enum({
    SystemChange: 0,// 系统修改
    Consume: 1, // 合成消耗
    Make: 2,    // 生成
    Cultivate: 3,// 种植
    BountyTaskReturn: 4,//任务退还
    Transfer: 5, // 转移
    TaskBonus: 6, // 任务奖励
    Harvest: 7, //种植收获
});

const ArticleRecordSchema = new SimpleSchema({
    _id: String,
    type: ArticleRecordType,
    user: String,
    number: Number,
    current: Number,
    articleId: Number,
    createdAt: Date,
    userData: {
        type: Object,
        blackbox: true,
        optional: true
    }
});
ArticleRecordSchema.extend(BaseSchema);

const ArticleRecord = new Collection("articleRecord");
ArticleRecord.attachSchema(ArticleRecordSchema);

export {
    Article,
    ArticleBag,
    ArticleRecord,
    ArticleRecordType
}
