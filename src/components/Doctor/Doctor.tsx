import React, { useState } from "react";
import { Contract, client } from "@/constants/Contract";

import {
  useReadContract,
  useActiveAccount,
  MediaRenderer,
} from "thirdweb/react";

interface ChildProps {
  input: string;
}

// const ChildComponent: React.FC<ChildProps> = ({ input }) => {
//   const wallet = useActiveAccount();
//   const walletAddress = wallet?.address || "";

//   const { data: record_list } = useReadContract({
//     contract: Contract,
//     method: "getDocuments",
//     params: [input],
//   });

//   return record_list ? (
//     <div className="text-center">
//       <h4 className="text-4xl">Records List</h4>
//       <ul className="grid grid-cols-2 gap-4">
//         {record_list.map((url, index) => (
//           <MediaRenderer key={index} client={client} src={url} />
//         ))}
//       </ul>
//     </div>
//   ) : (
//     <div className="text-center">
//       <h3>No Records found</h3>
//     </div>
//   );
// };

const ChildComponent: React.FC<ChildProps> = ({ input }) => {
  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";

  const { data: record_list } = useReadContract({
    contract: Contract,
    method: "getDocuments",
    params: [input],
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    console.log("The url " + url);
    setSelectedImage(url);
  };

  return (
    <div className="text-center bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
      {selectedImage ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
          <MediaRenderer client={client} src={selectedImage} />
          <button
            onClick={() => setSelectedImage(null)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <h4>Records List</h4>
          <ul className="grid grid-cols-2 gap-4">
            {record_list &&
              record_list.map((url, index) => (
                <li
                  key={index}
                  onClick={() => handleImageClick(url)}
                  className="cursor-pointer"
                >
                  <MediaRenderer client={client} src={url} />
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

const Doctor: React.FC = () => {
  const [selectedPatient, setSelectPatient] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";

  const { data: patient_list } = useReadContract({
    contract: Contract,
    method: "patientsUnderDoctor",
    params: [walletAddress],
  });

  const view = (pat_address: string) => {
    setSelectPatient(pat_address);
  };

  const handleRecordChange = (event: React.ChangeEvent<HTMLLIElement>) => {
    setSelectedRecord(event.target.textContent);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center mb-4 text-5xl">Patient Lists</h2>
        <div>
          <ul className="space-y-2">
            {patient_list?.map((user, index) => (
              <li
                key={index}
                onClick={() => view(user)}
                className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                {user}
              </li>
            ))}
          </ul>
        </div>
        {selectedPatient !== "" && <ChildComponent input={selectedPatient} />}
        {(!patient_list || patient_list.length === 0) && (
          <div className="text-center mt-4">No Patient Records found</div>
        )}
      </div>
    </div>
  );
};

export default Doctor;
