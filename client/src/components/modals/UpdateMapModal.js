import React, { useState } 	from 'react';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateMapModal = (props) => {
	const [input, setInput] = useState({name: ''});


	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateMap = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				console.log(input.name)
				alert('All fields must be filled out to create map');
				return;
			}
		}
		props.updateMapField(props.currentMapId, "name", input.name, props.currentMapName)
        props.setShowUpdate(false);
	};

	return (
        // Replace div with WModal

		<WModal className="signup-modal" visible={true} cover={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowUpdate(false)}>
				Update Map Name
			</WMHeader>

			{
                <WMMain>
						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-col-gap signup-modal ">
							<WCol size="2" className="modal-body">
							</WCol>
							<WCol size="2" className="modal-body">
								Map Name:
							</WCol>
							<WCol size="6">
								<WInput 
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up"  autoFocus={true} 
									barAnimation="solid" labelText="*Enter Map Name Here*" wType="outlined" inputType="text" defaultValue={props.currentMapName}
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<div className="modal-spacer">&nbsp;</div>

						<WRow className="modal-col-gap">
							<WCol size="2" ></WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={handleUpdateMap} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Update Map Name
							</WButton>
							</WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={() => props.setShowUpdate(false)} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Cancel
							</WButton>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>

					</WMMain>
			}
		</WModal>
	);
}

export default UpdateMapModal;
