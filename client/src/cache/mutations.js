import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;


export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $name: String!, $_id: String!) {
		update(email: $email, password: $password, name: $name, _id: $_id) {
			email
			password
			name
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!, $index: Int) {
		addMap(map: $map, index: $index) 
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!, $index: Int) {
		updateMapField(_id: $_id, field: $field, value: $value, index: $index)
	}
`;

export const UPDATE_MAP_FIELD_ARRAY = gql`
	mutation UpdateMapFieldArray($_id: String!, $field: String!, $value: [String]) {
		updateMapFieldArray(_id: $_id, field: $field, value: $value)
	}
`;

export const ADD_ITEM = gql`
	mutation AddItem($item: ItemInput!, $_id: String!, $index: Int!) {
		addItem(item: $item, _id: $_id, index: $index)
	}
`;

export const DELETE_ITEM = gql`
	mutation DeleteItem($itemId: String!, $_id: String!) {
		deleteItem(itemId: $itemId, _id: $_id) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const UPDATE_ITEM_FIELD = gql`
	mutation UpdateItemField($_id: String!, $itemId: String!, $field: String!, $value: String!) {
		updateItemField(_id: $_id, itemId: $itemId, field: $field, value: $value) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const REORDER_ITEMS = gql`
	mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
		reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
			_id
			id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const SORT_ITEMS = gql`
mutation SortItems($_id: String!, $items: [ItemInput]!){
	sortItems(_id: $_id, items: $items)
	}
`;

export const ADD_TODOLIST = gql`
	mutation AddTodolist($todolist: TodoInput!) {
		addTodolist(todolist: $todolist) 
	}
`;

export const DELETE_TODOLIST = gql`
	mutation DeleteTodolist($_id: String!) {
		deleteTodolist(_id: $_id)
	}
`;

export const UPDATE_TODOLIST_FIELD = gql`
	mutation UpdateTodolistField($_id: String!, $field: String!, $value: String!) {
		updateTodolistField(_id: $_id, field: $field, value: $value)
	}
`;
