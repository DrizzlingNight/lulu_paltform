import {Article, ArticleBag, ArticleRecord, ArticleRecordType} from "../collections";
import {errorCodes} from "../../../../settings/errorCodes";
import {transaction} from "../../../core/database";
import {Random} from 'meteor/random'
import {Decimal} from 'meteor/mongo-decimal';

export const getArticles = async function (user, types) {
    let popline = [
        {$match: {user: user._id, number: {$gt: 0}}},
        {
            $lookup: {
                from: 'article',
                localField: 'articleId',
                foreignField: '_id',
                as: 'info'
            }
        },
        {$unwind: "$info"},
        {
            $lookup: {
                from: 'article',
                localField: 'info.converTo',
                foreignField: '_id',
                as: 'info.converTo.info'
            }
        }
    ]
    if (types && types.length > 0)
        popline.push({$match: {"info.type": {$in: types}}})
    return await ArticleBag.rawCollection().aggregate(popline).toArray();
}
export const getArticleRecordSum = async function (userId) {
    let popline = [
        {$match: {user: userId}},
        {
            $group: {
                _id: {
                    type: "$type",
                    articleId: "$articleId"
                },
                number: {$sum: "$number"}
            }
        }
    ]
    let articleSum = await ArticleRecord.rawCollection().aggregate(popline).toArray()
    let articles = await Article.find({}).fetch()
    return {articleSum, articles}
}
export const addArticle = async function ({user, articleId, number, type, userData}, session) {
    if (number <= 0)
        throw new Meteor.Error(500, errorCodes.InvalidAmount)
    let res = await ArticleBag.findOneAndUpdate(
        {articleId: Number(articleId), user: user},
        {$inc: {number: Decimal(number)}},
        {upsert: true, returnOriginal: false, session})


    await ArticleRecord.insertOne({
        _id: Random.id(),
        type,
        user: user,
        number,
        current: res.value ? res.value.number : number,
        articleId: parseInt(articleId),
        createdAt: new Date(),
        userData: userData
    }, {session})

    return res.value
}


export const removeArticle = async function ({user, articleId, number, type}, session) {
    if (number <= 0)
        throw new Meteor.Error(500, errorCodes.InvalidAmount)
    let res = await ArticleBag.findOneAndUpdate(
        {articleId: Number(articleId), user: user},
        {$inc: {number: Number(-number)}},
        {returnOriginal: false, session})

    if (res.ok !== 1 || res.lastErrorObject.n !== 1) {
        throw new Meteor.Error(500, errorCodes.FragmentNotEnough)
    }

    await ArticleRecord.insertOne({
        _id: Random.id(),
        type,
        user: user,
        number: Number(-number),
        current: res.value.number,
        articleId: res.value.articleId,
        createdAt: new Date()
    }, {session})

    return res.value
}

export const makeArticle = async function (user, articleId) {
    let article = await ArticleBag.findOne({user, articleId})
    let articleInfo = await Article.findOne({_id: articleId})
    if (!article || article.number < articleInfo.numConvert)
        throw new Meteor.Error(500, errorCodes.FragmentNotEnough)
    let number = Decimal(article.number).div(articleInfo.numConvert).truncated()
    await transaction.run(async session => {
        await removeArticle({
            user,
            articleId: articleId,
            number: number.times(articleInfo.numConvert).toNumber(),
            type: ArticleRecordType.Consume
        }, session)
        await addArticle({
            user,
            articleId: articleInfo.converTo,
            number: number.toNumber(),
            type: ArticleRecordType.Make
        }, session)
    })
    let newArticle = await Article.findOne({_id: articleInfo.converTo})
    return {
        consume: {info: articleInfo, number: number.times(articleInfo.numConvert).toNumber()},
        make: {info: newArticle, number: number.toNumber()}
    }
}
