import React, { useRef } from 'react';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './style.css';
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser';

const ViewPrescription = () => {
  const prescriptionRef = useRef(null);
  const location = useLocation();
  const rowData = location.state;
  const handleDownload = () => {
    const element = prescriptionRef.current;
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('prescription.pdf');
    });
  };

  console.log('rowData', rowData);
const medicineName = rowData?.medicineName?.map((item) => item)
  return (
    <div className="container">
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
        >
          <span>
            <FaDownload />
          </span>
          Download Form
        </button>
      </div>
      <div className="prescription-card" ref={prescriptionRef}>
        {/* Clinic Header */}
        <div className="clinic-header flex">
          <div className="d-flex align-items-center">
            <svg className="clinic-logo" viewBox="0 0 24 24">
              <path fill="#c0392b" d="M12,2L4,2v6H2v6h2v6h8v-6h6v-6h-6V2z" />
            </svg>
          </div>
          <div className="clinic-details-data w-full text-center">
            <div className="clinic-name">
              <span className="clinic-name">Sharda Clinic</span>
            </div>
            <div className="clinic-address">
              <p>
                Clinic 1: 68/181, Mount Road, Shankar Nagar, Jaipur (Timing:
                Morning 10:00 AM to 1:00 AM)
              </p>
              <p>
                Clinic 2: Pratap Nagar, Near Pinkcity Hotel, Ramgarh Mode,
                Jaipur (Timing: Evening 6:00 PM to 9:30 PM)
              </p>

              <p>Mobile No.: 77378-38455 | E-mail: sanjayganjo0482@gmall.com</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Section */}
          <div className="left-section">
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Dr. Sanjay Ganjoo</h5>
              </div>
              <div className="doctor-position-details">
                <span>B.U.M.S (Gen. Physician)</span>
                <span>Asso. Professor & H.O.D. at</span>
                <span>Govt. UCU. Tonk (Raj.)</span>
              </div>
            </div>
            {/*  */}
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Ex. Medical Officer</h5>
              </div>
              <div className="doctor-position-details">
                <span>Govt. of Jammu & Kashmir</span>
              </div>
            </div>
            {/*  */}
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Ex. Resident Doctor</h5>
              </div>
              <div className="doctor-position-details">
                <span>at Gopinath Hospital Jaipur</span>
              </div>
            </div>
            {/*  */}
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Ex. Resident Doctor</h5>
              </div>
              <div className="doctor-position-details">
                <span>at Khetan Hospital Murlipura, Jaipur</span>
              </div>
            </div>
            {/*  */}
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Ex. Member of Board of Studies</h5>
              </div>
              <div className="doctor-position-details">
                <span>
                  DSRRA University Jodhpur <br />
                  Reg. No. 1584
                </span>
              </div>
            </div>
            {/*  */}
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Dr. Piyush Agarwal</h5>
              </div>
              <div className="doctor-position-details">
                <span>M.B.B.S. (MS)Ortho</span>
                <span>Fortis Hospital Jaipur</span>
                <span>Reg. No. 15135</span>
              </div>
            </div>
            {/*  */}
            <div className="doctor-position">
              <div className="doctor-position-heading">
                <h5>Dr. Prashant Kothari</h5>
              </div>
              <div className="doctor-position-details">
                <span>S. DNB (CVTS)</span>
                <span>Cardio Vascular and Thoracic Surgeon</span>
                <span>Mahatma Gandhi Hospital, Jaipur</span>
                <span>Reg. No. 17132</span>
              </div>
            </div>
            {/*  */}
          </div>

          {/* Right Section */}
          <div className="right-section">
            {/* Patient Info */}
            <div className="patient-info">
              <div className="patient-info-row">
                <div className="patient-info-label">Patient Name:</div>
                <div className="patient-info-value">{rowData?.username}</div>
              </div>
              <div className="patient-info-row">
                <div className="patient-info-label-date">Date:</div>
                <div className="patient-info-value">{rowData?.ticketDate}</div>
              </div>
            </div>

            {/* Prescription Content */}
            <div className="rx-symbol">℞</div>
            <div className="medicine-list">
              {
                rowData?.medicineName &&  <div class="medication-prescription-card">
                <h1>Medication Details</h1>
                <div class="medication-details">
                  <p>
                    <strong>Medication Name:</strong> {rowData?.medicineName?.map((item) => <span>{item},</span>)}
                  </p>
                  <p>
                    <strong>Dosage:</strong> 1 capsule
                  </p>
                  <p>
                    <strong>Frequency:</strong> Three times a day
                    (morning, afternoon, evening)
                  </p>
                  {/* <p>
                    <strong>Duration:</strong> 7 days
                  </p> */}
                  <p>
                    <strong>Instructions:</strong> Take after meals with
                    a glass of water.
                  </p>
                </div>
              </div>
              }
           
                      {/*  */}
                      {
                        rowData?.DiagnosticName && <div class="diagnostic-card mt-5">
                        <h1>Diagnostic Report</h1>
                        <div class="test-details medication-details">
                          <h2>MRI Test Details</h2>
                          <p><strong>Test Name:</strong> {rowData?.DiagnosticName?.map((item) => <span>{item},</span>)}</p>
                          {/* <p><strong>Patient Name:</strong> John Doe</p>
                          <p><strong>Date of Test:</strong> December 1, 2024</p> */}
                          <p><strong>Diagnostic Center:</strong> City Diagnostics, New York</p>
                          <p><strong>Impression:</strong> No evidence of abnormal mass or lesion. Normal ventricular system and brain parenchyma. No intracranial hemorrhage detected.</p>
                        </div>
                        {/* <div class="additional-notes">
                          <h3>Additional Notes</h3>
                          <p>Please consult your physician for a detailed interpretation of the MRI findings.</p>
                        </div> */}
                      </div>
                      }
                      
  {/*  */}

              {/*  */}
            </div>
            <div className="patients description mt-4">
              <p>{parse(rowData?.ticketDescription)}</p>
            </div>

            {/* Signature */}
            {/* <div className="signature-section">
              <div>Dr's Signature: _________________</div>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="footer-text">(Not Valid for Medical Legal Purpose)</div>
      </div>
    </div>
  );
};

export default ViewPrescription;