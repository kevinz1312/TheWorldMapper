import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			// props.refetchTodos();
			toggleLoading(false)
			props.setShowLogin(false)
		};
	};


	return (
        // Replace div with WModal

		<WModal className="login-modal" visible="true">
			<WMHeader className="modal-header" onClose={() => props.setShowLogin(false)}>
				Login
			</WMHeader>

			{
				loading ? <div />
					: <WMMain className="main-login-modal">
						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-col-gap login-modal ">
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
						<WRow className="modal-col-gap login-modal ">
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
							<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Login
							</WButton>
							</WCol>
							<WCol size="4" >
							<WButton className="modal-button" onClick={() => props.setShowLogin(false)} span clickAnimation="ripple-light" hoverAnimation="darken" shape="default" color="primary">
								Cancel
							</WButton>
							</WCol>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<div className="modal-spacer">&nbsp;</div>
						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}
					</WMMain>
			}
		</WModal>
	);
}

export default Login;