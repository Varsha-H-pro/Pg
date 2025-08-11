import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ComplaintsChart from "./complainsChart";
import { useDispatch } from "react-redux";
import { getAllProperty } from "../redux/slice/propertySlice";

function AdminDashboard() {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState([]);
  const dispatch = useDispatch();

  async function loadProperties() {
    const response = await dispatch(getAllProperty());
    if (response?.payload?.sucess) {
      setPropertyData(response?.payload?.data);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTenant = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col"
    >
      <header className="bg-gray-300 shadow">
        <div className="flex justify-between w-full py-4 px-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Welcome, Admin
          </motion.h1>
        </div>
      </header>

      <main className="flex items-start gap-6 w-full h-[75%] px-5 py-2">
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-slate-200 flex justify-center items-center w-[75%] h-screen border-2 rounded-md shadow-lg px-4 py-6 overflow-hidden"
        >
          <div className="chart-container flex justify-center items-center w-full h-full">
            <ComplaintsChart />
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-slate-200 flex flex-col justify-start items-center w-[25%] h-screen border-2 rounded-lg shadow-lg px-4 py-6 gap-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/addbuilding")}
            className="w-full bg-blue-600 text-white hover:text-black hover:bg-white rounded-md hover:outline hover:outline-blue-600 duration-500 p-4 h-1/3 shadow-lg shadow-blue-300"
          >
            Add building
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/listbuilding")}
            className="w-full bg-blue-600 text-white hover:text-black hover:bg-white rounded-md hover:outline hover:outline-blue-600 duration-500 p-4 h-1/3 shadow-lg shadow-blue-300"
          >
            View Building Data &rarr;
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddTenant}
            className="w-full bg-blue-600 text-white hover:text-black hover:bg-white rounded-md hover:outline hover:outline-blue-600 duration-500 p-4 h-1/3 shadow-lg shadow-blue-300"
          >
            Add Tenant &rarr;
          </motion.button>

          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="modal-box bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="modal-content">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    Select Property
                  </h2>
                  <ul className="divide-y divide-gray-200">
                    {propertyData &&
                      propertyData.map((data) => (
                        <li key={data.id} className="py-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              navigate("/adduser", { state: { st: {cards:{ ...data }} } })
                            }
                            className="btn btn-outline btn-accent w-full"
                          >
                            {data.name}
                          </motion.button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="modal-action mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary w-full"
                    onClick={handleCloseModal}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}

export default AdminDashboard;