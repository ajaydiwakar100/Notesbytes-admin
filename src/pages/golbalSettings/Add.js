import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams,useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { SAVE_SETTING_API,GET_ALL_SETTINGS_API } from '../../config';

const AddGlobalSettings = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [adminPreTransactionRate, setAdminPreTransactionRate] = useState('');
    const [userDesposistFeeRate, setUserDesposistFeeRate] = useState('');
    const [userTransferToAnotherUserRate, setUserTransferToAnotherUserRate] = useState('');
    const [userWithdrawalFeeRate, setUserWithdrawalFeeRate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const token = localStorage.getItem('token'); 

    // Check if ID is present in the URL
    const { id } = params;
    const isEditing = !!id;
    
    const fetchSettings = async () => {
        try {
            const response = await axios.post(GET_ALL_SETTINGS_API,{ id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            setPhoneNumber(response.data.data.admin_phone_number);
            setEmailAddress(response.data.data.admin_email);
            setAddress(response.data.data.admin_address);
            setAdminPreTransactionRate(response.data.data.admin_pre_transaction_rate);
            setUserWithdrawalFeeRate(response.data.data.user_withdrawal_fee_rate);
            setUserDesposistFeeRate(response.data.data.user_desposist_fee_rate);
            setUserTransferToAnotherUserRate(response.data.data.user_transfer_to_another_user_rate);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };
   
    // Call fetchSettings only once when the component mounts
    useEffect(() => {
        if (isEditing) {
            fetchSettings();
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
      
        if (name === 'admin_phone_number') {
            setPhoneNumber(value);
        } else if (name === 'admin_email') {
            setEmailAddress(value);
        } else if (name === 'admin_address') {
            setAddress(value);
        } else if (name === 'admin_pre_transaction_rate') {
            setAdminPreTransactionRate(value);
        } else if (name === 'user_withdrawal_fee_rate') {
            setUserWithdrawalFeeRate(value);
        } else if (name === 'user_desposist_fee_rate') {
            setUserDesposistFeeRate(value);
        } else if (name === 'user_transfer_to_another_user_rate') {
            setUserTransferToAnotherUserRate(value);
        } 
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

         // Check if email and password are not empty
         if (!emailAddress.trim() || !phoneNumber.trim() || !address.trim()
            || !adminPreTransactionRate.trim() || !userDesposistFeeRate.trim() || !userWithdrawalFeeRate.trim()
            || !userTransferToAnotherUserRate.trim() )
         {
            // If either field is empty, set an error message and return early
            toast.error('Please enter required fields');
            return;
        }

        try {
            
            const bodyParms = {
                "admin_address" :  address,
                "admin_email" :  emailAddress,
                "admin_phone_number" :  phoneNumber,
                "admin_pre_transaction_rate" :  adminPreTransactionRate,
                "user_desposist_fee_rate" :  userDesposistFeeRate,
                "user_transfer_to_another_user_rate" :  userTransferToAnotherUserRate,
                "user_withdrawal_fee_rate" :  userWithdrawalFeeRate,
                "id":id
            };
            console.log(bodyParms);
            const response = await axios.post(SAVE_SETTING_API, bodyParms,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            if (response.status === 200) {
                toast.success('Gobal setting save successful');
                setTimeout(() => {
                    navigate('/gobal-setting');
                }, 3000);
            } else {
                // Handle other status codes if needed
                toast.error('someting went wrong');
            }
        } catch (error) {
            toast.error('An error occurred while saving global settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark"> {isEditing ? 'Edit ': 'Add'} Global Settings</h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <div className="box-main">
                        <div className="box-main-table">
                            <div className="container-fluid">
                                <form onSubmit={handleSubmit}>
                                      
                                    <div className='row'> 
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Email Address</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="admin_email" 
                                                    id="admin_email" 
                                                    placeholder="Enter Email Address" 
                                                    className="form-control"
                                                    value={emailAddress}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div> 
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Phone Number</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="admin_phone_number" 
                                                    id="admin_phone_number" 
                                                    placeholder="Enter Phone Number" 
                                                    className="form-control"
                                                    value={phoneNumber}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>    
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Address</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="admin_address" 
                                                    id="admin_address" 
                                                    placeholder="Enter Address" 
                                                    className="form-control"
                                                    value={address}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>    
                                    </div>  

                                    <div className='row'> 
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">Admin Pre Transaction Rate</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="admin_pre_transaction_rate" 
                                                    id="admin_pre_transaction_rate" 
                                                    placeholder="Enter Admin Pre Transaction Rate" 
                                                    className="form-control"
                                                    value={adminPreTransactionRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div> 
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Deposist Fee Rate</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="user_desposist_fee_rate" 
                                                    id="user_desposist_fee_rate" 
                                                    placeholder="Enter User Deposist Fee Rate" 
                                                    className="form-control"
                                                    value={userDesposistFeeRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>    
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Transfer To Another User Rate</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="user_transfer_to_another_user_rate" 
                                                    id="user_transfer_to_another_user_rate" 
                                                    placeholder="Enter User Transfer To Another User Rate" 
                                                    className="form-control"
                                                    value={userTransferToAnotherUserRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>    
                                    </div>    

                                    <div className='row'> 
                                        <div className='col-lg-4'>
                                            <div className="form-group">
                                                <label htmlFor="key" className="lableClass">User Withdrawal Fee Rate</label>
                                              
                                                <input 
                                                    type="text" 
                                                    name="user_withdrawal_fee_rate" 
                                                    id="user_withdrawal_fee_rate" 
                                                    placeholder="Enter User Withdrawal Fee Rate" 
                                                    className="form-control"
                                                    value={userWithdrawalFeeRate}
                                                    onChange={handleChange}
                                                    style={{ marginTop: '5px' }}
                                                />
                                            </div>
                                        </div>    
                                    </div>  
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </form>  
                            </div>
                        </div>
                    </div>
                </div>
            </section>         
        </div>
    );

}
export default AddGlobalSettings;