import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import toast from 'react-hot-toast';
import { validationSchema } from './DoctorSchema';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ModalProps {
  getFunction: () => void;
  setOpenAddModal: (open: boolean) => void;
  openModal: boolean;
  addPatientsId : string;
}
interface SpecializationItem {
  _id: string;
  specialization: string;
}
// const states = ['California', 'Texas', 'Florida', 'New York', 'Illinois'];
interface SpecializationItem {
  _id: string;
  specialization: string;
}

const specializationList: SpecializationItem[] = [
  { _id: '1', specialization: 'Cardiology' },
  { _id: '2', specialization: 'Dermatology' },
  { _id: '3', specialization: 'Neurology' },
];
const cities = {
  California: ['Los Angeles', 'San Diego', 'San Francisco'],
  Texas: ['Houston', 'Dallas', 'Austin'],
  Florida: ['Miami', 'Orlando', 'Tampa'],
  NewYork: ['New York City', 'Buffalo', 'Rochester'],
  Illinois: ['Chicago', 'Springfield', 'Naperville'],
};

interface Diagnostic {
  id: string;
  name: string;
}

const diagnostic: Diagnostic[] = [
  { id: '1', name: 'Blood Test' },
  { id: '2', name: 'X-Ray' },
  { id: '3', name: 'MRI Scan' },
  { id: '4', name: 'CT Scan' },
  { id: '5', name: 'Ultrasound' },
];

const AddDoctorRegistration: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId
}) => {
  const [specializationList, setSpecializationList] = useState<
    SpecializationItem[]
  >([]);
  console.log("addPatientsId" , addPatientsId);
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [Cities, setCities] = useState<string[]>([]);
  const [selectedDiagnostics, setSelectedDiagnostics] = useState<Diagnostic[]>(
    [],
  );
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    SpecializationItem[]
  >([]);
  const [description, setDescription] = useState<string>('');
  const token = localStorage.getItem(localStorageKeys.token);
  const [filteredCities, setFilteredCities] = useState<string>('');
  console.log('states', Cities);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }
      const formData = new FormData();
      formData.append('registrationNumber', values.registrationNumber || '');
      formData.append('folderName', 'plating');
      formData.append('mobile', values.mobile || '');
      formData.append('name', values.name || '');
      formData.append('specialization', values.specialization || '');
      formData.append('state', values.state || '');
      formData.append('City', values.city || '');
      formData.append('Pincode', values.pincode || '');
      formData.append('Language', values.language || '');
      formData.append('Gender', values.gender || '');
      formData.append('Age', values.age || '');
      formData.append('isClicnic', values.isClinic ? 'true' : 'false');
      if (values.clinicName) {
        formData.append('clinicName', values.clinicName || '');
      }
      if (values.clinicAddress) {
        formData.append('clinicAddress', values.clinicAddress || '');
      }
      values.images.forEach((file: File) => {
        formData.append('images', file);
      });

      const res = await Apiservice.postAuth(
        apiEndPoints.doctorRegister.add,
        formData,
        token,
      );

      if (res?.data?.success) {
        toast.success('Add Doctor Registration Successfully');
        resetForm();
        setImagePreviews([]);
        setOpenAddModal(false);
        getFunction();
      }
    } catch (error) {}
    console.log('Form submitted with values:', values);
  };

  const getSpecailization = async () => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }

      let url = `${apiEndPoints.specialization.list}`;
      const res = await Apiservice.getAuth(url, token);

      if (res && res.data.success) {
        setSpecializationList(res?.data?.data?.documents);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSpecailization();
  }, []);

  return (
    <Dialog open={openModal} fullWidth maxWidth="md">
      <DialogTitle>
        Add Patient
        <IconButton
          onClick={() => setOpenAddModal(false)}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Formik
          initialValues={{
            NameOfPatient: '',
            mobile: '',
            patientDate: '',
            specialization: '',
            address: '',
            gender: '',
            age: '',
            description: '',
            amount : '',
            note : ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => {
            return (
              <Form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Registration Number */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Name Of Patient
                    </label>
                    <Field
                      name="NameOfPatient"
                      placeholder="Name Of Patient"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="NameOfPatient"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Patient Mobile No.
                    </label>
                    <Field
                      name="mobile"
                       placeholder="Patient Mobile No."
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Patient Date
                    </label>
                    <Field
                      name="patientDate"
                      type="date"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="patientDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Age
                    </label>
                    <Field
                      name="age"
                      placeholder="Enter Age"
                      type="text"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Address
                    </label>
                    <Field
                      name="address"
                      placeholder="Enter Address"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <Autocomplete
                      multiple
                      options={specializationList}
                      getOptionLabel={(option) => option.specialization}
                      value={selectedSpecializations}
                      onChange={(event, newValue) =>
                        setSelectedSpecializations(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Medicine"
                          placeholder="Select Medicine"
                          variant="outlined"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option._id}
                            label={option.specialization}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                    />
                  </div>

                  {/*  */}
                  <div>
                    <Autocomplete
                      multiple
                      options={diagnostic}
                      getOptionLabel={(option) => option.name}
                      value={selectedDiagnostics}
                      onChange={(event, newValue) =>
                        setSelectedDiagnostics(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Diagnostics"
                          placeholder="Select Diagnostics"
                          variant="outlined"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            key={option.id}
                            label={option.name}
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                    />
                  </div>

                 {/*  */}
                 <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Amount
                    </label>
                    <Field
                      name="amount"
                      placeholder="Enter Amount"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/*  */}
                  {/*  */}
                 <div>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Note
                    </label>
                    <Field
                     placeholder="Enter Note"
                      name="note"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/*  */}

                </div>

                <div className='mt-5'>
            
            <ReactQuill
            className='h-32'
              value={values.description}
              onChange={(value) => setFieldValue('description', value)}
              placeholder="Write a description..."
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

                {/* Submit Button */}
                <DialogActions>
                  <button
                    type="submit"
                    className="w-full mt-15 mx-auto max-w-xs inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    Add Patient
                  </button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorRegistration;
