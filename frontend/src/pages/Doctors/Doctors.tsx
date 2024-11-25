import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import { MaterialReactTable, MRT_SortingState } from 'material-react-table';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import AddDoctorRegistration from './AddDoctorRegistration';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton, MenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import { MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES_CONST } from '../../constant/routeConstant';
import WhatsAppComponent from "../../components/whatsapp/WhatsappComponents.jsx"
const Listbox = styled('ul')(
  () => `
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 12px;
    margin: 12px 0;
    min-width: 150px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background : #fff;
    border: 1px solid #DAE2ED;
    color: #1C2025;
    box-shadow: 0px 4px 6px 'rgba(0,0,0, 0.05)';
    z-index: 1;
    `,
);

const Doctors: React.FC = () => {
  const [patient, setPatient] = useState([])
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const [addPatientsId, setAddPatientsId] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);
  // const [AddOpenModalData , setAddOpenModalData] = useState<object>({});

  const token = localStorage.getItem(localStorageKeys.token);
const navigate = useNavigate(); 



const columns = [
  {
    header: 'ID',
    accessorKey: 'SrNo',
    enableSorting: false,
    size: 70,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Name Of Patient',
    accessorKey: 'name',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Mobile No.',
    accessorKey: 'mobileNo',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Gender',
    accessorKey: 'gender',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Patient Date',
    accessorKey: 'updatedAt',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      if (!value) return 'N/A';
      const date = new Date(value);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
  },
  {
    header: 'Age',
    accessorKey: 'age',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Address',
    accessorKey: 'address',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Medicine',
    accessorKey: 'medicine',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Diagnostics',
    accessorKey: 'diagnostics',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Description',
    accessorKey: 'description',
    enableSorting: false,
    size: 100,
    Cell: ({ cell }) => cell.getValue() || 'N/A',
  },
  {
    header: 'Payment Reminder',
    enableColumnActions: false,
    enableSorting: false,
    size: 150,
    Cell: ({ row }) => (
      <WhatsAppComponent
      phoneNumber="9057280563"
      message="Hello! Here is your prescription."
      pdfLink="https://example.com/path-to-prescription.pdf"
    />
    ),
  },
  {
    header: 'Actions',
    accessorKey: '_id',
    size: 120,
    enableSorting: false,
    Cell: ({ cell }) => {
      console.log("cellcell" , cell);
      
      const id = cell.getValue();
      return id ? (
        <Dropdown>
          <MenuButton aria-label="More actions">
            <MoreHorizIcon />
          </MenuButton>
          <Menu className="z-99999">
            <MenuItem onClick={() => navigate(`${ROUTES_CONST.VIEWPATIENT}/${id}`)}>
              View
            </MenuItem>
            <MenuItem 
            onClick={() => {
              setAddOpenModal(prev => !prev);
              setAddPatientsId(cell?.row?.original?._id)
            }}
            >
              Add
            </MenuItem>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
          </Menu>
        </Dropdown>
      ) : (
        'N/A'
      );
    },
  },
];



  const getPatient = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }


      let url = `${apiEndPoints.patient.list}?page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}&role=doctor`

      if (sorting.length) {
        url = url + `&sortBy=${sorting[0]?.id}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}`
      }
      if (searchTerms) {
        url = url + `&search=${searchTerms}`
      }

      const res = await Apiservice.getAuth(url, token)
      if (res && res.data.success) {
        const newarr = res.data.data.documents.map((obj: object, index: number) => {
          return { ...obj, SrNo: index + 1 + pageState.pageIndex * pageState.pageSize }
        })
        setPatient(newarr)
        setTotalPages(res.data.data.pagination?.totalChildrenCount);
      }
    } catch (error) {
      console.log(error)
    }
  }


  const blockHandler = async (id: string, status: boolean) => {
    try {

      if (!token) {
        throw new Error("Token is missing.")
      }

      const url = `${apiEndPoints.patient.toggle}?id=${id}&status=${!status}`
      const res = await Apiservice.getAuth(url, token)
      if (res && res.data.success) {
        toast.success(res.data.message)
        getPatient()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPatient()
  }, [pageState, sorting, searchTerms]);

  const AddDoctorModal = () => {
    setAddOpenModal(prev => !prev);
  }


  return (

    <>

      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Patients" />
        <div className="flex gap-3">
          <button
            onClick={AddDoctorModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Patient
          </button>
        </div>
      </div>

      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={patient}
          manualPagination
          manualSorting
          paginationDisplayMode={'pages'}
          rowCount={totalPages}
          onSortingChange={setSorting}
          manualFiltering={true}
          enableColumnFilters={false}
          enableColumnActions={false}
          onGlobalFilterChange={setSearchTerm}
          muiPaginationProps={{
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined',
          }}
          state={{
            pagination: pageState,
            sorting: sorting
          }}
          onPaginationChange={(state) => {
            setPageState(state);
          }}


        />
      </div>
      <AddDoctorRegistration
        openModal={AddOpenModal}
        setOpenAddModal={setAddOpenModal}
        getFunction={getPatient}
        addPatientsId={addPatientsId}
      />
    </>
  )
}

export default Doctors;
