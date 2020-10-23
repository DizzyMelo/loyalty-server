class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //DELETES THE FIELDS I DONT WANT TO FILTER BY
    excludedFields.forEach((el) => delete queryObject[el]);

    // ADVANCED FILTERING

    let queryStr = JSON.stringify(queryObject);
    // \b means that only the exact same words needs to match
    // g means that I want to replace multiple expressions
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      //Projecting name duration price
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
