import {Enum} from "../utils/enum";

const errorCodes = new Enum({
    // 公共
    FailedOpt: "10001",                 //"操作失敗"
    RepeatOpt: "10002",                 //"重複操作"
    ThrottleLimit: "10003",             //"超出頻率限制"
    InvalidParams: "10004",             //"參數錯誤"
    NotImplement: "10005",              //"功能未實現"
    PermissionError: "10006",           //"权限错误"
    VerificationCodeError: "10101",     //"驗證碼錯誤"
    LoginRequired: "10102",             //"請登錄"
    ObjNotFound: "10404",               //"目标未找到"
    OptErr: "10500",                    //"操作失败"


    // 賬戶
    InvalidToken: "20001",              //"賬戶內部錯誤"
    AccountExists: "20002",             //"賬戶已存在"
    ReferralInvalid: "20003",           //"邀請鏈接無效"
    InvalidUser: "20004",               //"用戶信息錯誤"
    UserTokenError: "20005",            //"用戶token錯誤"
    NotEnoughToken: "20006",            //"餘額不足"
    InvalidAmount: "20007",             //"金額錯誤"
    DailyMaxLimitWithdraw: "20008",     //"超出提現每日限額"
    InvalidTransOrder: "20009",         //"訂單錯誤"
    TradePasswordError: "20010",        //"交易密碼錯誤",
    SubscriptionExists: "20011",        //"已訂閲",
    MiningError: "20012",               //"挖矿错误",
    InvalidContract: "20013",           //"不支持的合约",
    AddFundPoolErr: "20014",            //"分红池加入失败",
    BindUserExisted: "20015",           //"绑定信息已存在",

    // 盲盒
    NotEnoughBlindBox: "20101",         //"盲盒数量不足"

    FundPoolChangeError: "20201",       //"基金池變動错误",

    StakePoolChangeError: "20301",      //"质押变动错误"
    StakeAmountError: "20302",          //"质押数量错误


    // Task
    RewardReceived: '30001',            //"獎勵已領取過"
    RewardNotFound: '30002',            //"獎勵不存在"
    RewardConditionMatchError: '30003', //"未達到領取條件"
    TaskInvalid: '30010',               //"任务无效"

    // BountyTask
    BountyTaskInvalid: '31001',         //"任务无效"
    TaskNumberInvalid: '31002',         //"任务数量错误"
    ReceiveTaskError: '31003',          //"任务领取失败"
    CancelTaskError: '31004',           //"任务取消失败"
    DelTaskError: '31005',              //"任务删除失败"
    ReceiveTaskRewardsError: '31006',   //"任务奖励领取失败"
    CloseTaskError: '31007',            //"任务关闭失败"
    TaskUpdateError: '31008',           //"任务收益更新失败"

    // Guide
    GuideInvalid: '32001',              //"引导无效"

    // game
    SlotInvalid: '40001',               //"插槽不可用"
    LandInvalid: '40002',               //"土地不可用"
    SeedInvalid: '40003',               //"物料不可用"
    StartRoundError: '40004',           //"开始游戏错误"
    GameRoundInvalid: '40005',          //"结束游戏错误"
    RandomError: '40006',               //"随机错误"
    ReleaseSlotError: '40007',          //"插槽释放错误"
    SeedNumberInvalid: '40008',         //"物料数量错误"
    FragmentNotEnough: '40009',         //"碎片数量不足"
    MarketError: '40010',               //"行情错误"
});

const errCodeExchangeKV = function () {
    let exchangeErrCode = {};
    Object.keys(errorCodes).forEach(function (key) {
        if (exchangeErrCode[errorCodes[key]])
            return null;
        exchangeErrCode[errorCodes[key]] = key;
    });
    return exchangeErrCode;
};

export {errorCodes, errCodeExchangeKV}
