const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

module.exports = {
    Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		}

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
			const { id, name, owner } = map;
			const newList = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
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