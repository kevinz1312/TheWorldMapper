import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteMapModal = (props) => {

    const handleDelete = async () => {
        props.deleteMap(props.currentMapId);
        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" visible={true} cover={true}>
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                Delete Map?
			</WMHeader>

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal>
    );
}

export default DeleteMapModal;