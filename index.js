// DD INIT - start
const httpServerOptions = {
    middleware: false,
};
const graphqlOptions = {
    depth: 2,
    collapse: true,
    signature: false
};
const tracer = require('dd-trace');
tracer.init({
    plugins: false
});
tracer.use('http', {
    server: httpServerOptions,
});
tracer.use('express', httpServerOptions);
tracer.use('graphql', graphqlOptions);
// DD INIT - end

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

    type Person {
        name: String
    }

    extend type Publisher @key(fields: "id") {
        id: ID! @external
    }

    type Book @key(fields: "isbn") {
        isbn: String!
        title: String
        author: Person!
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
        author: (obj) => {
            return {name: 'Peter Clark'};
        },
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