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
		}
    }

}