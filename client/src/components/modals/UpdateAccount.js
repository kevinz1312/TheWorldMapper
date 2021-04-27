import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateAccount = (props) => {
	const [input, setInput] = useState({ email: props.user.email, password: '', name: props.user.name, _id: props.user._id});
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to update');
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input }});
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			toggleLoading(false);
			props.fetchUser();
			props.setShowUpdate(false);
		};
	};

	return (
        // Replace div with WModal

		<WModal className="signup-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowUpdate(false)}>
				Enter Updated Account Information
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-col-gap signup-modal ">
							<WCol size="3" className="modal-body">
							</WCol>
							<WCol size="1" className="modal-body">
								Name:
							</WCol>
							<WCol size="6">
								<WInput 
									className="modal-input" id="modal-input-update-name" onBlur={updateInput} name="name" labelAnimation="up"
									barAnimation="solid" labelText="*Enter Name Here*" wType="outlined" inputType="text" defaultValue={props.user.name} 
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-col-gap signup-modal ">
							<WCol size="3" className="modal-body">
							</WCol>
							<WCol size="1" className="modal-body">
								Email:
							</WCol>
							<WCol size="6">
								<WInput 
								className="modal-input" id="modal-input-update-email" onBlur={updateInput} name="email" labelAnimation="up"
								barAnimation="solid" labelText="*Enter Email Here*" wType="outlined" inputType="text" defaultValue={props.user.email}
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-col-gap signup-modal ">
							<WCol size="3" >
							</WCol>
							<WCol size="1" className="modal-body">
								Password:
							</WCol>
							<WCol size="6">
								<WInput 
								className="modal-input" id="modal-input-update-password" onBlur={updateInput} name="password" labelAnimation="up"  autoFocus={true}
								barAnimation="solid" labelText="*Enter Password Here*" wType="outlined" inputType="password"
								/>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<div className="modal-spacer">&nbsp;</div>

						<WRow className="modal-col-gap">
							<WCol size="2" ></WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={handleUpdateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Update Account
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

export default UpdateAccount;
