import React, { useEffect, useState } from "react";
import api from '../../../services/apiInterceptor';

// Import all module images
import complaintLogo from '../../../../src/assets/images/logo_complaint.png';
import requisitionLogo from '../../../../src/assets/images/logo_requisition.png';
import vehicleLogo from '../../../../src/assets/images/logo_vehicle.png';
import fundsLogo from '../../../../src/assets/images/logo_fund.png';
import distributionLogo from '../../../../src/assets/images/logo_distribution.png';
import trainingLogo from '../../../../src/assets/images/logo_training.png';
import misLogo from '../../../../src/assets/images/logo_management.png';
import documentsLogo from '../../../../src/assets/images/logo_document.png';

const Default = () => {
  const [modules, setModules] = useState([]);

  // Modern object mapping
  const moduleConfig = {
    2: { image: complaintLogo, fullName: "Complaint Management System" },
    3: { image: requisitionLogo, fullName: "Requisition Management System" },
    4: { image: vehicleLogo, fullName: "Vehicle Management System" },
    5: { image: fundsLogo, fullName: "Funds Management System" },
    6: { image: distributionLogo, fullName: "Distribution Management System" },
    7: { image: trainingLogo, fullName: "Training Management System" },
    9: { image: misLogo, fullName: "Management Management System" },
    13: { image: documentsLogo, fullName: "Document Management System" }
  };

  const allowedIds = [2, 3, 4, 5, 6, 7, 9, 13];

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await api.get(`application/GetApplication`);
      
      const filteredModules = res.data.modules
        ?.filter(module => allowedIds.includes(module.id))
        ?.map(module => ({
          ...module,
          ...moduleConfig[module.id]
        })) || [];
      
      setModules(filteredModules);
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  // ✅ Smart alignment logic
  const shouldCenterAlign = modules.length > 4;
  const firstFourModules = modules.slice(0, 4);
  const remainingModules = modules.slice(4);

  return (
    <div className="container mt-4">
      {/* ✅ Agar 4 ya usse kam modules hain to sab left-aligned */}
      {!shouldCenterAlign && modules.length > 0 && (
        <div className="row justify-content-start">
          {modules.map((module) => (
            <div key={module.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
              <ModuleCard module={module} />
            </div>
          ))}
        </div>
      )}

      {/* ✅ Agar 4 se zyada modules hain to: */}
      {shouldCenterAlign && (
        <>
          {/* Line 1: First 4 cards center-aligned */}
          <div className="row justify-content-center mb-4">
            {firstFourModules.map((module) => (
              <div key={module.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                <ModuleCard module={module} />
              </div>
            ))}
          </div>

          {/* Line 2: Remaining cards left-aligned */}
          {remainingModules.length > 0 && (
            <div className="row justify-content-start">
              {remainingModules.map((module) => (
                <div key={module.id} className="col-xl-3 col-lg-3 col-md-6 col-sm-6 mb-4">
                  <ModuleCard module={module} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ✅ Separate component for card to avoid code repetition
const ModuleCard = ({ module }) => {
  return (
    <div 
      className="card shadow-sm module-card border-0 transition-all" 
      style={{ 
        height: "150px",
        backgroundColor: "rgba(var(--bs-light-rgb), var(--bs-bg-opacity, 1)) !important",
        transition: "all 0.3s ease-in-out",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
      }}
    >
      <a
        href={module.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center"
      >
        <div className="card-body text-center p-2">
          <div className="d-flex justify-content-center align-items-center">
            <img
              src={module.image}
              alt={module.fullName}
              className="img-fluid transition-all"
              style={{ 
                height: "280px", 
                width: "280px",
                objectFit: "contain",
                transition: "transform 0.3s ease-in-out"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Default;