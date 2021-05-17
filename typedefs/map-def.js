const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String
		id: Int
		name: String
		owner: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
		subregions: [String]
		root: Boolean
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
		subregions: [String]
		root: Boolean
	}
	extend type Query {
		getAllMaps(_id: String!): [Map]
		getMapById(_id: String!): Map
		getDBMapAncestors(_id: String!): [Map]
		getAllSubRegions(_id: String!): [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!, index: Int): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!, index: Int): String
		updateMapFieldArray(_id: String!, field: String!, value: [String]): Boolean
	}
`;

module.exports = { typeDefs: typeDefs }