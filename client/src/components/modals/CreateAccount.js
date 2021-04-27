import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: ''});
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
			}
			props.setShowCreate(false);

		};
	};

	return (
        // Replace div with WModal

		<WModal className="signup-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowCreate(false)}>
				Create a New Account
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
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up" 
									barAnimation="solid" labelText="*Enter Name Here*" wType="outlined" inputType="text" 
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
								className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
								barAnimation="solid" labelText="*Enter Email Here*" wType="outlined" inputType="text" 
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
								className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
								barAnimation="solid" labelText="*Enter Password Here*" wType="outlined" inputType="password" 
								/>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<div className="modal-spacer">&nbsp;</div>

						<WRow className="modal-col-gap">
							<WCol size="2" ></WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={handleCreateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Create Account
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

export default CreateAccount;
