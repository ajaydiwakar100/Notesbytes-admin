// config.js
const DEV_BASE_URL   = 'http://3.22.121.28/dev/api/admin/';
const LOCAL_BASE_URL = 'http://localhost:8080/api/admin/';

//export const BASE_URL = LOCAL_BASE_URL;
export const BASE_URL = LOCAL_BASE_URL;
export const LoginAPI = `${BASE_URL}login`;
export const OTP_VERIFICATION_API = `${BASE_URL}verify-otp`;
export const PROFILE_UPDATE_API = `${BASE_URL}update-profile`;
export const CHANGE_PASSWORD_API = `${BASE_URL}change-password`;
export const LOGOUT_API = `${BASE_URL}logout`;

//Users Api 
export const getAllUsersAPI = `${BASE_URL}users/get-users-list`;
export const getUserProfileAPI = `${BASE_URL}users/get-profile`;
export const updateKycAndVerifiedStatus = `${BASE_URL}users/update-kyc-and-verified-status`; 

//Users Api 
export const getAllAgentAPI = `${BASE_URL}agents/get-agent-list`;
export const getAgentProfileAPI = `${BASE_URL}agents/get-profile`;
export const updateKycAndVerifiedStatusForAgent = `${BASE_URL}agents/update-kyc-and-verified-status`; 

//GobalSetting Api 
export const GET_ALL_SETTINGS_API = `${BASE_URL}gobal-settings/get-gobal-settings-list`;
export const SAVE_SETTING_API    = `${BASE_URL}gobal-settings/add-gobal-settings`;
export const addGobalSetting    = `${BASE_URL}gobal-settings/add-gobal-settings`;
export const editGobalSetting   = `${BASE_URL}gobal-settings/edit-gobal-settings`;
export const deleteGobalSetting   = `${BASE_URL}gobal-settings/delete-gobal-settings`;

// Fetch Modules With Permission
export const FETCH_ROLES_MODULES_API   = `${BASE_URL}module/list`;
export const ADD_ROLE_API   = `${BASE_URL}roles/add`;
export const LIST_ROLE_API  = `${BASE_URL}roles/list`;
export const GET_ROLE_API   = `${BASE_URL}roles/view`;
export const CHANGE_STATUS_ROLE_API   = `${BASE_URL}roles/change-status`;

// Subadmin  
export const CREATE_SUB_ADMIN_API   = `${BASE_URL}sub-admin/create`;
export const LIST_SUB_ADMIN_API   = `${BASE_URL}sub-admin/list`;
export const VIEW_SUB_ADMIN_API   = `${BASE_URL}sub-admin/view`;
export const UPDATE_SUB_ADMIN_API   = `${BASE_URL}sub-admin/update`;
export const CHANGE_SUB_ADMIN_STATUS_API   = `${BASE_URL}sub-admin/change-status`;

// users  
export const CREATE_USERS_API   = `${BASE_URL}end-users/create`;
export const LIST_USERS_API   = `${BASE_URL}end-users/list`;
export const VIEW_USERS_API   = `${BASE_URL}end-users/view`;
export const CHANGE_USERS_STATUS_API   = `${BASE_URL}end-users/change-status`;

//documents
export const GET_DOCS_BY_USER_ID   = `${BASE_URL}document/list`;
export const UPDATE_DOCS_STATUS   = `${BASE_URL}document/change-status`;
export const APPROVED_REJECTED_STATUS   = `${BASE_URL}document/approved-reject-status`;
export const GET_DOC_DETAILS   = `${BASE_URL}document/view`;

