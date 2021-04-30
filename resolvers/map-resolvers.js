const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

module.exports = {
    Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, args, { req }) => {
			const { _id} = args;
			const objectId = new ObjectId(_id);
			if(!objectId) { return([])};
			const maps = await Map.find({owner: objectId});
			if(maps) return (maps);

		},
		/** 
		 	@param 	 {object} args - a map id
			@returns {object} a map on success and an empty object on failure
		**/
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},

    },
    Mutation: {
        /** 
		 	@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { map } = args;
			let objectId;
			if (map._id === '')
				objectId = new ObjectId();
			else 
				objectId = new ObjectId(map._id);
			const { id, name, owner, capital, leader, flag } = map;
			const newList = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				capital: capital,
				leader: leader,
				flag: flag,
			});
			const updated = newList.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		/** 
		 	@param 	 {object} args - a map objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
		/** 
		 	@param 	 {object} args - a Map objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},
    }

}