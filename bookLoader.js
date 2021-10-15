const DataLoader = require('dataloader');

const booksDataMock = [
    {
        publisher: {
            id: 'P001'
        },
        isbn: 'ABC1234',
        title: 'The Awakening',
    },
    {
        publisher: {
            id: 'P002'
        },
        isbn: 'XYZ1234',
        title: 'City of Glass',
    },
    {
        publisher: {
            id: 'P003'
        },
        isbn: 'PQR1234',
        title: 'Glass House',
    },
    {
        publisher: {
            id: 'P003'
        },
        isbn: 'PQR6789',
        title: 'Pete Decker',
    },
];

// aux function that will format the result to be ordered by the given ids,
// otherwise dataloader throws an error
const formatResult = (books, ids) => {
    const bookMap = {};
    books.forEach(book => {
        bookMap[book.isbn] = book;
    });

    return ids.map(id => bookMap[id]);
};

const batchbooks = async ids => {
    try {
        console.log(ids);
        let books = booksDataMock.filter(e => ids.includes(e.isbn));
        return formatResult(books, ids);
    } catch (err) {
        throw new Error('There was an error getting the books.');
    }
};

module.exports = {
    bookDataLoader: () => new DataLoader(batchbooks, { maxBatchSize: 2 }),
    booksDataMock,
}; // batch size will depend on external service