const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
	}
	extend type Query {
		getAllMaps: [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String

	}
`;

module.exports = { typeDefs: typeDefs }