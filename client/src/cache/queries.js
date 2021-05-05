import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps($_id: String!) {
		getAllMaps(_id: $_id) {
			_id
			id
			name
			owner
			capital
			leader
			flag
			subregions
			landmarks
			root
		}
	}
`;

export const GET_DB_SUBREGIONS = gql`
	query GetAllSubRegions($_id: String!) {
		getAllSubRegions(_id: $_id) {
			_id
			id
			name
			owner
			capital
			leader
			flag
			subregions
			landmarks
			root
		}
	}
`;

export const GET_DB_MAP_BY_ID = gql`
	query GetDBMapById($_id: String!) {
		getMapById(_id: $_id) {
			_id
			id
			name
			owner
			capital
			leader
			flag
			subregions
			landmarks
			root
		}
	}
`;

export const GET_DB_MAPS_ANCESTORS = gql`
	query GetDBMapAncestors($_id: String!) {
		getDBMapAncestors(_id: $_id) {
			_id
			id
			name
			owner
			capital
			leader
			flag
		}
	}
`;