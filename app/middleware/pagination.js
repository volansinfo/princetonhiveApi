const getPaginationData = (data, page, limit) => {
    const { count: totalItems, rows: dataItems } = data
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)


    return {
        dataItems,
        totalItems,
        currentPage,
        totalPages
    }
}

const getPagination = (page, size) => {
    const limit = size ? +size : 10
    const offset = page ? +page * limit : 0

    return {
        limit,
        offset
    }
}

const pagination = {
    getPagination,
    getPaginationData
}

module.exports = pagination