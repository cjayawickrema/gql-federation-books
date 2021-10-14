const {ApolloServer, gql} = require('apollo-server');
const {buildFederatedSchema} = require('@apollo/federation');

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
        publisher(book) {
            return {__typename: "Publisher", id: book.publisher.id};
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}])
});


// The `listen` method launches a web server.
server.listen(4001).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});