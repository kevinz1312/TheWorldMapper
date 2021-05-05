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
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllSubRegions: async (_, args, { req }) => {
			let subregions = []
			let region;
			const { _id} = args;
			const objectId = new ObjectId(_id);
			if(!objectId) { return([])};
			const parentRegion = await Map.findOne({_id: objectId});
			const subRegionIDs = parentRegion.subregions;
			for(let i = 0; i< subRegionIDs.length; i++){
				region = await Map.findOne({_id: new ObjectId(subRegionIDs[i])});
				subregions.push(region)
			}
			if(subregions) return (subregions);

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

		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of ancestor map objects on success, and an empty array on failure
		**/
		getDBMapAncestors: async (_, args, { req }) => {
			let { _id} = args;
			let objectId = new ObjectId(_id);
			let ancestorRegions= [];
			if(!objectId) { return([])};
			
			if(_id !== req.userId){
				let map = await Map.findOne({_id: objectId});
				if(map === null)
					return([])
				_id = map.owner;
				objectId = new ObjectId(_id);

				while(_id !== req.userId){
				map = await Map.findOne({_id: objectId});
				if(map === null)
				return([])
				ancestorRegions.unshift(map);
				_id = map.owner;
				objectId = new ObjectId(_id);
				}
			}
			if(ancestorRegions) return (ancestorRegions);
		},

    },
    Mutation: {
        /** 
		 	@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { map, index } = args;
			let objectId;
			if (map._id === '')
				objectId = new ObjectId();
			else 
				objectId = new ObjectId(map._id);
			const { id, name, owner, capital, leader, flag, landmarks, subregions, root} = map;
			const newList = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				capital: capital,
				leader: leader,
				flag: flag,
				landmarks: landmarks,
				subregions: subregions,
				root: root
			});
			const updated = newList.save();

			if(root === false){
			const parentObjectId = new ObjectId(owner)
			const parentMap = await Map.findOne({_id: parentObjectId});
			let parentSubRegions = parentMap.subregions;
			if(index < 0)
				parentSubRegions.push(objectId)
			else 
				parentSubRegions.splice(index, 0, objectId);
			const parentUpdated = await Map.updateOne({_id: parentObjectId}, { subregions: parentSubRegions })
			}

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
			const map = await Map.findOne({_id: objectId});
			if(map.root === false){
				const parentObjectId = new ObjectId(map.owner)
				const parentMap = await Map.findOne({_id: parentObjectId});
				let parentSubRegions = parentMap.subregions;
				const index = parentSubRegions.indexOf(objectId)
				parentSubRegions.splice(index, 1)
				const parentUpdated = await Map.updateOne({_id: parentObjectId}, { subregions: parentSubRegions })
			}
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
		updateMapFieldArray: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			let newSortedArray = [];
			for(let i = 0; i< value.length; i++){
				let tempItem = value[i];
				newSortedArray.push(tempItem);
			}
			const updated = await Map.updateOne({_id: objectId}, {[field]: newSortedArray});
			if(updated) return true;
				else 
				return false
		},
    }

}