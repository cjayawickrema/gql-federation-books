const {ApolloServer, gql} = require('apollo-server');
const {buildFederatedSchema} = require('@apollo/federation');

const { booksDataMock, bookDataLoader } = require('./bookLoader');

const typeDefs = gql`

    extend type Publisher @key(fields: "id") {
        id: ID! @external
    }

    type Book @key(fields: "isbn") {
        isbn: String!
        title: String
        publisher: Publisher
    }

    type Query {
        books: [Book]
    }
`;

const resolvers = {
    Query: {
        books: () => booksDataMock,
    },
    Book: {
        __resolveReference(book, {bookLoader}) {
            return bookLoader.load(book.isbn);
        },
        publisher(book) {
            return {__typename: "Publisher", id: book.publisher.id};
        },        
    }
};
 
const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}]),
    context: () => ({
        bookLoader: bookDataLoader()
    }),
});


// The `listen` method launches a web server.
server.listen(4001).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});