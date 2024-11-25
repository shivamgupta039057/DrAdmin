import React, { useRef } from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./style.css";

const ViewPatients = () => {
  const prescriptionRef = useRef(null);

  const handleDownload = () => {
    const element = prescriptionRef.current;
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("prescription.pdf");
    });
  };

  return (
    <div className="container">
     <div className="flex justify-end" >
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
        <div className="clinic-header">
          <div className="d-flex align-items-center">
            <svg className="clinic-logo" viewBox="0 0 24 24">
              <path
                fill="#c0392b"
                d="M12,2L4,2v6H2v6h2v6h8v-6h6v-6h-6V2z"
              />
            </svg>
            <span className="clinic-name">Sharda Clinic</span>
          </div>
          <div className="clinic-address">
            Clinic T: 68183, Miami Road, Shakti Nagar
            <br />
            Delhi-5 Palam Nagar, (New Private Trading) West Delhi
            <br />
            Mobile: 7773-2981 | Email: shardaclinic@gmail.com
            <br />
            Timing: 10:00 AM to 1:00 PM & 5:00 PM to 9:00 PM
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Section */}
          <div className="left-section">
            <div className="doctor-info">
              <div className="doctor-name">Dr. Sanjay Ganjoo</div>
              <div className="doctor-qualifications">
                <div>Ex. Medical Officer</div>
                <div>Ex. Resident Doctor</div>
                <div>Ex. Emergency Doctor</div>
                <div>At Deen Dayal Hospital</div>
                <div>Ex. Member of Studies</div>
              </div>
              <div className="reg-number">
                OSRRM University of Delhi
                <br />
                Reg. No. 15684
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="right-section">
            {/* Patient Info */}
            <div className="patient-info">
              <div className="patient-info-row">
                <div className="patient-info-label">Patient Name:</div>
                <div className="patient-info-value">Shivam gupta</div>
              </div>
              <div className="patient-info-row">
                <div className="patient-info-label">Date:</div>
                <div className="patient-info-value"></div>
              </div>
            </div>

            {/* Prescription Content */}
            <div className="rx-symbol">℞</div>
            <div className="medicine-list">
              <ol>
                <li>Augmentin 625mg 1 tab × BD × 5 days</li>
                <li>Zerodol-SP 1 tab</li>
                <li>T. Fexxaro Tab. 1 tab</li>
                <li>T. Omtroclo 60g once daily</li>
                <li>T. Calbo MD 1 tab</li>
                <li>Citralka Syp. 2 tsp × BD after food</li>
              </ol>
            </div>

            {/* Signature */}
            <div className="signature-section">
              <div>Dr's Signature: _________________</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-text">(Not Valid for Medical Legal Purpose)</div>
      </div>
    </div>
  );
};

export default ViewPatients;
