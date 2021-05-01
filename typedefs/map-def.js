const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		capital: String!
		leader: String!
		flag: String!
		landmarks: [String]
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		capital: String!
		leader: String!
		flag: String!
		landmarks: [String]
	}
	extend type Query {
		getAllMaps(_id: String!): [Map]
		getMapById(_id: String!): Map 
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String

	}
`;

module.exports = { typeDefs: typeDefs }