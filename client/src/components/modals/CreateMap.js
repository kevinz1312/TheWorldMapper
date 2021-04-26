import React, { useState } 	from 'react';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const CreateMap = (props) => {
	const [input, setInput] = useState({name: ''});


	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateMap = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to create map');
				return;
			}
		}
        props.createNewMap(input.name);
        props.setShowCreate(false);
	};

	return (
        // Replace div with WModal

		<WModal className="signup-modal" visible={true} cover={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowCreate(false)}>
				Create a New Map
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
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up" 
									barAnimation="solid" labelText="*Enter Map Name Here*" wType="outlined" inputType="text" 
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<div className="modal-spacer">&nbsp;</div>

						<WRow className="modal-col-gap">
							<WCol size="2" ></WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={handleCreateMap} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Create Map
							</WButton>
							</WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={() => props.setShowCreate(false)} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
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

export default CreateMap;
