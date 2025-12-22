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

const ChildComponent: React.FC<ChildProps> = ({ input }) => {
  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";

  console.log("address", walletAddress);

  const { data: record_list } = useReadContract({
    contract: Contract,
    method: "getDoctorAccessibleDocuments",
    params: [walletAddress as `0x${string}`, input as `0x${string}`],
  });

  console.log("docs", record_list);

  return record_list ? (
    <div>
      <div>
        Records List
        <ul>
          {record_list.map((document, index) => (
            <MediaRenderer
              key={index}
              client={client}
              src={document?.documentURI}
            />
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div>
      <h3>No Records found</h3>
    </div>
  );
};

const Doctor: React.FC = () => {
  const [selectedPatient, setSelectPatient] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  console.log("The Selected Record is: ", selectedRecord);

  const wallet = useActiveAccount();
  const walletAddress = wallet?.address || "";

  console.log("address", walletAddress);

  const { data: patient_list } = useReadContract({
    contract: Contract,
    method: "getMyPatients",
    params: [walletAddress as `0x${string}`],
  });

  console.log("the Patient", patient_list);

  const view = (pat_address: string) => {
    setSelectPatient(pat_address);
  };

  const handleRecordChange = (event: React.ChangeEvent<HTMLLIElement>) => {
    setSelectedRecord(event.target.textContent);
  };

  if (patient_list && patient_list.length > 0) {
    console.log("inside the if block");

    return (
      <div className="doc_block">
        <div className="SecondPage">
          Patient Lists
          <div>
            <ul>
              {patient_list.map((user, index) => (
                <li
                  key={index}
                  onClick={() => view(user)}
                  onChange={handleRecordChange}
                >
                  {user}
                </li>
              ))}
            </ul>
          </div>
          {selectedPatient !== "" && <ChildComponent input={selectedPatient} />}
        </div>
      </div>
    );
  } else {
    console.log("in the else block");
    return (
      <div className="doc_block">
        <div className="SecondPage">No Patient Records found</div>
      </div>
    );
  }
};

export default Doctor;
