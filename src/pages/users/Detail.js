import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { getUserProfileAPI, updateKycAndVerifiedStatus } from '../../config';
import { useParams } from 'react-router-dom';


function UserDetail() {
    const { id } = useParams();
    const [users, setUsers] = useState({
        // Initial state of users
        kycApproved: 0, // Assuming kycApproved is initially false
        is_block_user: '0',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchUsers(id);
    }, [id]);

    const token = localStorage.getItem('token'); // Parse as boolean
    
    const handleKycApprovalToggle  = async (id,type,status) => {
        try {
            // Call your API to update the KYC approval status
            const response = await axios.post(updateKycAndVerifiedStatus,{ 
                id, 
                type,
                status: status // Toggle status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update the state with the new KYC approval status received from the API response
            setUsers({
                ...users,
                is_kyc_approved: response.data.data.is_kyc_approved
            });
        } catch (error) {
            console.error('Error toggling KYC approval:', error);
            // Handle error if needed
        }
    };

    const handleAdminApprovalToggle  = async (id,type,status) => {
        try {
            // Call your API to update the KYC approval status
            const response = await axios.post(updateKycAndVerifiedStatus,{ 
                id, 
                type,
                status: status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update the state with the new KYC approval status received from the API response
            setUsers({
                ...users,
                is_block_user: response.data.data.is_block_user
            });
        } catch (error) {
            console.error('Error toggling admin verified approval:', error);
            // Handle error if needed
        }
    };
    
    const fetchUsers = async (id) => {
        try {
            const response = await axios.post(getUserProfileAPI,{ id }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            setUsers(response.data.data);
            setLoading(false);
            setError(null);

        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Manage User </h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <div className="box-main">
                        <div className="box-main-top">
                            <div className="box-main-title">User Details </div>
                        
                        </div>
                   
                        <div className="box-main-table">
                                {/* <div className="text-center">
                                    <div className="profile-img">
                                        <img src="" alt=""/>
                                        
                                    </div>
                                </div>   */}
                            <div  > 
                                <div className="col-lg-12">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">First Name  </label>
                                            <br/>
                                            <span className='spanclassTxt'> { users.first_name || 'N/A' }</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Last Name </label>
                                            <br/>
                                            <span className='spanclassTxt'> { users.last_name || 'N/A' }</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">NIF  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.nif || 'N/A' }</span>
                                        </div>
                                    </div>    
                                </div> 
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">Phone Number  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.country_code}-{ users.phone_number || 'N/A' }</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Email Address  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.email || 'N/A' }</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Current Balance  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.current_balance || '0' }</span>
                                        </div>
                                    </div>    
                                </div>   
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">Home  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.addressDetails?.home ?? 'N/A'}</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">Street  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.addressDetails?.street ?? 'N/A'}</span>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="lableClass">City  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.addressDetails?.city ?? 'N/A'}</span>
                                        </div>
                                    </div>    
                                </div>    
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-4">
                                            <label className="lableClass">Zip  </label>
                                            <br/>
                                            <span className='spanclassTxt'>{ users.addressDetails?.zip ?? 'N/A'}</span>
                                        </div>
                                        {users.kycFileNames && users.kycFileNames.length > 0 ? (
                                            <div className="col-lg-4">
                                                <label className="lableClass"> Kyc Verificatiom </label>
                                                <br/>
                                                {/* <label className="switch"  style={{ marginTop: '5px' }}>
                                                    <input type="checkbox" checked={users.is_kyc_approved}  onChange={() => handleKycApprovalToggle(users._id, '1', users.is_kyc_approved ? '1' : '0')} />
                                                    <span className="slider round"></span>
                                                </label> */}
                                                
                                                {users.is_kyc_approved === 0 ? (
                                                    <div>
                                                        <a onClick={() => handleKycApprovalToggle(users._id, '1', '2')}>
                                                            <i className="fa fa-times-circle disblecheck fa-lg"
                                                                style={{ color: 'red',  fontSize: '25px',  marginTop: '10px'}}></i>
                                                        </a>
                                                        <a onClick={() => handleKycApprovalToggle(users._id, '1', '1')}>
                                                            <i className="fa fa-check-circle enablecheck fa-lg" 
                                                            style={{ marginLeft: '10px', color: 'green',  fontSize: '25px',  marginTop: '10px'}}></i>
                                                        </a>    
                                                    </div>
                                                ) : (
                                                    null
                                                )}
        
                                                <span className='spanclassTxt'>{
                                                    users.is_kyc_approved == 1 ? 'Approved' :
                                                    users.is_kyc_approved == 2 ? 'Rejected' :
                                                    'Pending'
                                                }</span>
                                                
                                            </div>
                                        ) : (
                                            <div>
                                                <span className='spanclassTxt'></span>
                                            </div>
                                        )}
                                        
                                        <div className="col-lg-4">
                                            <label className="lableClass"> Block / Unblock </label>
                                            <br/>
                                            <label className="switch" style={{ marginTop: '5px' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={users.is_block_user === '1'}  
                                                onChange={(e) => handleAdminApprovalToggle(users._id, '3', e.target.checked ? '1': '0' )}
                                            />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>    
                                </div> 
                                <div className="col-lg-12 lableClassColClass">
                                    <div className="row">   
                                        <div className="col-lg-12">
                                            <label className="lableClass">Kyc Documents</label>
                                            <br/>
                                            <div className="row" style={{ marginTop: '10px' }}>
                                                {users.kycFileNames && users.kycFileNames.length > 0 ? (
                                                    users.kycFileNames.map((file, index) => (
                                                        <div key={index} className="col-lg-4 file-item">
                                                            <a href={`https://dev-notebytes.s3.amazonaws.com/dev/${file.fileName}`} target="_blank" rel="noopener noreferrer">
                                                                <img src={`https://dev-notebytes.s3.amazonaws.com/dev/${file.fileName}`} alt="file-icon" className="file-icon" />
                                                                <br/>
                                                                <span className='spanclassTxt'>{file.fileName}</span>
                                                            </a>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-lg-12">
                                                        <span className='spanclassTxt'>No KYC files found.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>    
                                </div>

                            </div>
                        </div>  
                    </div>    
                </div>
            </section>
        </div>   
    )
}

export default UserDetail;