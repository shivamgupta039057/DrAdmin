  const apiEndPoints = {
  auth: {
    login: '/user/login',
  },
  specialization:{
    list:"/specialization/readSpecialization",
    add:"/specialization/createSpecialization",
    delete:"/specialization/deleteSpecialization",
    edit:"/specialization/updateSpecialization"
  },
  medicine:{
    add : "/medicine/add",
    list : "/medicine/list",
    delete : "/medicine/delete"
  },
  diagnostic:{
    add : "/diagnostic/add",
    list : "/diagnostic/list",
    delete : "/diagnostic/delete"
  },
  patient:{
    list:"/user/user-list",
    toggle:"/user/enable-disable-user"
  },
  doctorRegister : {
  add : "/user/doctor-register"
  },
  search : {
    getState : "/search/getState",
    getCities : "/search/getCity",
    addCity : "/search/addCity",
    disableCity : "/search/enable-disable-city"
  }
  
   


};

export default apiEndPoints