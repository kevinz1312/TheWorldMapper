const { model, Schema, ObjectId } = require('mongoose');

const mapSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: false
		},
		leader: {
			type: String,
			required: false
		},
		flag: {
			type: String,
			required: false
		},
		landmarks:{
			type: [String],
			required: false
		},
		subregions:{
			type: [String],
			required: false
		},
		root:{
			type: Boolean,
			required: false
		}
	},
	{ timestamps: true }
);

const Map = model('Map', mapSchema);
module.exports = Map;