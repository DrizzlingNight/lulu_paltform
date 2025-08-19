const lists = []
export const getList = function () {
    return [lists.pop()]
}

export const setList = function (data) {
    return lists.unshift(data)
}