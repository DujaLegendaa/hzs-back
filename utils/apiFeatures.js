class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    const reqQuery = { ...this.queryString }
    const excludedFields = ['sort', 'page', 'limit', 'fields']
    excludedFields.forEach((el) => delete reqQuery[el])

    const queryString = JSON.stringify(reqQuery)
    const fixedQueryString = queryString.replace(
      /\b(gte|gt|lte|le)\b/g,
      (match) => '$' + match,
    )

    this.query = this.query.find(JSON.parse(fixedQueryString))

    return this
  }

  sort() {
    let sortBy = '-starsNum'
    if (this.queryString.sort)
      sortBy = this.queryString.sort.split(',').join(' ')
    this.query = this.query.sort(sortBy)

    return this
  }

  limitFields() {
    let selected = '-__v'
    if (this.queryString.fields)
      selected = this.queryString.fields.split(',').join(' ')
    this.query = this.query.select(selected)

    return this
  }

  paginate() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(10)

    return this
  }
}

module.exports = APIFeatures
