export class jsTPS_Transaction {
    constructor() {};
    doTransaction() {};
    undoTransaction () {};
}
/*  Handles list name changes, or any other top level details of a todolist that may be added   */
export class UpdateRegionField_Transaction extends jsTPS_Transaction {
    constructor(_id, field, prev, value, callback, oldFlag, newFlag) {
        super();
        this.prev = prev;
        this.update = value;
        this.field = field;
        this._id = _id;
        this.updateFunction = callback;
        this.oldFlag = oldFlag;
        this.newFlag = newFlag;
    }
    async doTransaction() {
		const { data } = await this.updateFunction({ variables: { _id: this._id, field: this.field, value: this.update }});
        if(this.field === "name")
            await this.updateFunction({ variables: { _id: this._id, field: "flag", value: this.newFlag }});
		return data;
    }
    async undoTransaction() {
        const { data } = await this.updateFunction({ variables: { _id: this._id, field: this.field, value: this.prev }});
        if(this.field === "name")
            await this.updateFunction({ variables: { _id: this._id, field: "flag", value: this.oldFlag }});
		return data;
    }
}

export class UpdateMapRegions_Transaction extends jsTPS_Transaction {
    // opcodes: 0 - delete, 1 - add 
    constructor(ownerID, regionID, region, opcode, addfunc, delfunc, index = -1) {
        super();
        this.index = index;
        this.ownerID = ownerID;
		this.regionID = regionID;
		this.region = region;
        this.addFunction = addfunc;
        this.deleteFunction = delfunc;
        this.opcode = opcode;
    }
    async doTransaction() {
		let data;
        this.opcode === 0 ? { data } = await this.deleteFunction({
							variables: { _id: this.regionID }})
						  : { data } = await this.addFunction({
							variables: { map: this.region, index: this.index }})
        if(this.opcode !== 0) {
            this.region._id = this.regionID = data.addMap;
        }
		return data;
    }
    // Since delete/add are opposites, flip matching opcode
    async undoTransaction() {
		let data;
        this.opcode === 1 ? { data } = await this.deleteFunction({
                            variables: { _id: this.regionID }})
                          : { data } = await this.addFunction({
							variables: { map: this.region, index: this.index }})
        if(this.opcode !== 1) {
            this.region._id = this.regionID = data.addMap;
        }
		return data;
    }
}

export class SortRegions_Transaction extends jsTPS_Transaction{
    constructor(parentRegionID, unsortedRegionIds, sortedRegionIds, callback){
        super();
        this.parentRegionID = parentRegionID;
		this.unsortedRegionIds = unsortedRegionIds;
		this.sortedRegionIds = sortedRegionIds;
        this.updateFunction = callback;
    }

    async doTransaction(){
        const { data } = await this.updateFunction({ variables: { _id: this.parentRegionID, field: "subregions", value: this.sortedRegionIds }});
        return data;
    }
    async undoTransaction(){
        const { data } = await this.updateFunction({ variables: { _id: this.parentRegionID, field: "subregions", value: this.unsortedRegionIds }});
        return data;
    }
}

export class ChangeLandmarks_Transaction extends jsTPS_Transaction{
    constructor(parentRegionID, originalLandmarks, updatedLandmarks, callback){
        super();
        this.parentRegionID = parentRegionID;
		this.originalLandmarks = originalLandmarks;
		this.updatedLandmarks = updatedLandmarks;
        this.updateFunction = callback;
    }

    async doTransaction(){
        const { data } = await this.updateFunction({ variables: { _id: this.parentRegionID, field: "landmarks", value: this.updatedLandmarks }});
        return data;
    }
    async undoTransaction(){
        const { data } = await this.updateFunction({ variables: { _id: this.parentRegionID, field: "landmarks", value: this.originalLandmarks }});
        return data;
    }
}

export class ChangeParent_Transaction extends jsTPS_Transaction{
    constructor(currentRegionId, originalParentId, updatedParentId, callback, index = -1){
        super();
        this.index = index;
        this.currentRegionId = currentRegionId;
		this.originalParentId = originalParentId;
		this.updatedParentId = updatedParentId;
        this.updateFunction = callback;
    }

    async doTransaction(){
        const { data } = await this.updateFunction({ variables: { _id: this.currentRegionId, field: "owner", value: this.updatedParentId, index: -1}});
        return data;
    }
    async undoTransaction(){
        const { data } = await this.updateFunction({ variables: { _id: this.currentRegionId, field: "owner", value: this.originalParentId, index: this.index }});
        return data;
    }
}

export class jsTPS {
    constructor() {
        // THE TRANSACTION STACK
        this.transactions = [];
        // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
        // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
        this.mostRecentTransaction = -1;
        // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
        // DO AND UNDO OPERATIONS ARE BEING PERFORMED
        this.performingDo = false;
        this.performingUndo = false;
    }
    
    /**
     * Tests to see if the do (i.e. redo) operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the do (i.e. redo) operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingDo() {
        return this.performingDo;
    }
    
    /**
     * Tests to see if the undo operation is currently being
     * performed. If it is, true is returned, if not, false.
     * 
     * return true if the undo operation is currently in the
     * process of executing, false otherwise.
     */
    isPerformingUndo() {
        return this.performingUndo;
    }
    
    /**
     * This function adds the transaction argument to the top of
     * the transaction processing system stack and then executes it. Note that it does
     * When this method has completed transaction will be at the top 
     * of the stack, it will have been completed, and the counter have
     * been moved accordingly.
     * 
     * param transaction The custom transaction to be added to
     * the transaction processing system stack and executed.
     */
    addTransaction(transaction) {
        // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
        // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
        if ((this.mostRecentTransaction < 0)|| (this.mostRecentTransaction < (this.transactions.length-1))) {
            for (let i = this.transactions.length-1; i > this.mostRecentTransaction; i--) {
                this.transactions.splice(i, 1);
            }
        }

        // AND NOW ADD THE TRANSACTION
        this.transactions.push(transaction);
        // AND EXECUTE IT
        // this.doTransaction();        
    }

    /**
     * This function executes the transaction at the location of the counter,
     * then moving the TPS counter. Note that this may be the transaction
     * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
     */
     async doTransaction() {
		let retVal;
        if (this.hasTransactionToRedo()) {   
            this.performingDo = true;
            let transaction = this.transactions[this.mostRecentTransaction+1];
			retVal = await transaction.doTransaction();
			this.mostRecentTransaction++;
			this.performingDo = false;
            
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
		console.log(' ')
		return retVal;
    }
    
    /**
     * This function checks to see if there is a transaction to undo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if undo is performed, if
     * there is no transaction to undo, null is returned.
     */
    peekUndo() {
        if (this.hasTransactionToUndo()) {
            return this.transactions[this.mostRecentTransaction];
        }
        else
            return null;
    }
    
    /**
     * This function checks to see if there is a transaction to redo. If there
     * is it will return it, if not, it will return null.
     * 
     * return The transaction that would be executed if redo is performed, if
     * there is no transaction to undo, null is returned.
     */    
    peekDo() {
        if (this.hasTransactionToRedo()) {
            return this.transactions[this.mostRecentTransaction+1];
        }
        else
            return null;
    }

    /**
     * This function gets the most recently executed transaction on the 
     * TPS stack and undoes it, moving the TPS counter accordingly.
     */
     async undoTransaction() {
		let retVal;
        if (this.hasTransactionToUndo()) {
            this.performingUndo = true;
            let transaction = this.transactions[this.mostRecentTransaction];
			retVal = await transaction.undoTransaction();
            this.mostRecentTransaction--;
			this.performingUndo = false;
        }
        console.log('transactions: ' + this.getSize());
        console.log('redo transactions:' + this.getRedoSize());
        console.log('undo transactions:' + this.getUndoSize());
        console.log(' ')
		return(retVal);
    }

    /**
     * This method clears all transactions from the TPS stack
     * and resets the counter that keeps track of the location
     * of the top of the stack.
     */
    clearAllTransactions() {
        // REMOVE ALL THE TRANSACTIONS
        this.transactions = [];
        
        // MAKE SURE TO RESET THE LOCATION OF THE
        // TOP OF THE TPS STACK TOO
        this.mostRecentTransaction = -1;        
    }
    
    /**
     * Accessor method that returns the number of transactions currently
     * on the transaction stack. This includes those that may have been
     * done, undone, and redone.
     * 
     * return The number of transactions currently in the transaction stack.
     */
    getSize() {
        return this.transactions.length;
    }
    
    /**
     * This method returns the number of transactions currently in the
     * transaction stack that can be redone, meaning they have been added
     * and done, and then undone.
     * 
     * return The number of transactions in the stack that can be redone.
     */
    getRedoSize() {
        return this.getSize() - this.mostRecentTransaction - 1;
    }

    /**
     * This method returns the number of transactions currently in the 
     * transaction stack that can be undone.
     * 
     * return The number of transactions in the transaction stack that
     * can be undone.
     */
    getUndoSize() {
        return this.mostRecentTransaction + 1;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be undone at the time this function is called.
     * 
     * return true if an undo operation is possible, false otherwise.
     */
    hasTransactionToUndo() {
        return this.mostRecentTransaction >= 0;
    }
    
    /**
     * This method tests to see if there is a transaction on the stack that
     * can be redone at the time this function is called.
     * 
     * return true if a redo operation is possible, false otherwise.
     */
    hasTransactionToRedo() {
        return this.mostRecentTransaction < (this.transactions.length-1);
    }
        
    /**
     * This method builds and returns a textual summary of the current
     * Transaction Processing System, this includes the toString of
     * each transaction in the stack.
     * 
     * return A textual summary of the TPS.
     */
    // toString() {
    //     let text = "<br>" +"--Number of Transactions: " + this.transactions.length + "</br>";
    //     text += "<br>" + "--Current Index on Stack: " + this.mostRecentTransaction + "</br>";
    //     text += "<br>" + "--Current Transaction Stack:" + "</br>";
    //     for (let i = 0; i <= this.mostRecentTransaction; i++) {
    //         let jsT = this.transactions[i];
    //         text += "<br>" + "----" + jsT.toString() + "</br>";
    //     }
    //     return text;
    // }
}