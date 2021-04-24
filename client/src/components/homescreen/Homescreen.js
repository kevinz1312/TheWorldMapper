import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction,
	SortItems_Transaction
 } 				from '../../utils/jsTPS';

const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SortTodoItems]			= useMutation(mutations.SORT_ITEMS);

	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { todolists = data.getAllTodos; }

	const auth = props.user === null ? false : true;
	const username = props.user === null ? "" : props.user.name;

	const checkButtonPressed = (event) => {
		if(event.ctrlKey && event.key === 'z')
			if(canUndo)
				tpsUndo();
		if(event.ctrlKey && event.key === 'y')
			if(canRedo)
				tpsRedo();
	}
	
	useEffect(()=> {
		document.addEventListener('keydown', checkButtonPressed);

		return () => {
			document.removeEventListener('keydown', checkButtonPressed);
		};

	})

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		let tempID = 0;

		if (items.length >= 1){
			for(let i =0; i< items.length; i++){
				if(items[i].id >= tempID)
				tempID = items[i].id + 1;
			}
		}
		const lastID = tempID;
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'None',
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		if(value !== prev){
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();
		}
	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewList = async () => {
		props.tps.clearAllTransactions();
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		const { data } = await AddTodolist({ variables: { todolist: list }});
		list._id = data;
		await refetchTodos(refetch);
		handleSetActive(list.id);
	};

	const sortItems = async (sortingCriteria) => {
		let itemsToSort = cloneItemsArray(activeList.items);
		
		let sortIncreasing = true;
		if (checkIncreasingOrder(itemsToSort, sortingCriteria))
			sortIncreasing = false;
		
		let compareFunction = makeCompareFunction(sortingCriteria, sortIncreasing);
		let listID = activeList._id;


		let itemsSorted = cloneItemsArray(itemsToSort);
		itemsSorted = cloneItemsArray(itemsSorted.sort(compareFunction));

		let transaction = new SortItems_Transaction(listID, itemsToSort, itemsSorted, SortTodoItems);

		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const cloneItemsArray = (oldArray) => {
		let newArray = [];
		for(let i = 0; i< oldArray.length; i++){
			let tempItem = {
				_id: oldArray[i]._id,
				id: oldArray[i].id,
				description: oldArray[i].description,
				due_date: oldArray[i].due_date,
				assigned_to: oldArray[i].assigned_to,
				completed: oldArray[i].completed
			};
			newArray.push(tempItem);
		}
		return newArray;
	}

	const checkIncreasingOrder = (itemsToTest, sortingCriteria) => {
		for (let i = 0; i < itemsToTest.length - 1; i++) {
			if (itemsToTest[i][sortingCriteria] > itemsToTest[i + 1][sortingCriteria])
			  return false;
		  }
		  return true;
	}

	const makeCompareFunction = (criteria, increasing) => {
		return function (item1, item2) {
		  let negate = -1;
		  if (increasing) {
			negate = 1;
		  }
		  let value1 = item1[criteria];
		  let value2 = item2[criteria];
		  if (value1 < value2) {
			return -1 * negate;
		  }
		  else if (value1 === value2) {
			return 0;
		  }
		  else {
			return 1 * negate;
		  }
		}
	  }

	const deleteList = async (_id, flag) => {
		props.tps.clearAllTransactions();
		if(!flag){
			DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
			refetch();
			setActiveList({});
		}
		else
			DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
	};

	const updateListField = async (_id, field, value, prev) => {
		if(value !== prev){
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();
		}
	};

	const handleSetActive = async (id) => {
		if(id != activeList.id){
			props.tps.clearAllTransactions();

		let newToDoList = [];
		for(let i=0; i< todolists.length; i++){
			let tempToDoList = {
				_id: todolists[i]._id,
				id: todolists[i].id,
				name: todolists[i].name,
				owner: todolists[i].owner,
				items: cloneItemsArray(todolists[i].items),
			};
			newToDoList.push(tempToDoList);
			await DeleteTodolist({ variables: { _id: todolists[i]._id }})
		}

		const tempElement = (element) => element.id === id;
		const tempIndex = newToDoList.findIndex(tempElement);
		const tempList = newToDoList[tempIndex];
		newToDoList.splice(tempIndex, 1);
		newToDoList.unshift(tempList);

		for(let i=0;i<newToDoList.length;i++){
			await AddTodolist({ variables: { todolist: newToDoList[i] }})
		}

		const todo =todolists.find(todo => todo.id === id || todo._id === id);
		setActiveList(todo);
		refetch();
		}
	}

	const handleSetInactive = () => {
		props.tps.clearAllTransactions();
		setActiveList({});
	}

	const canUndo = () => {
		return props.tps.hasTransactionToUndo();
	  }
	
	const canRedo = () => {
		return props.tps.hasTransactionToRedo();
	  }

	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	}

	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
							name={username}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;