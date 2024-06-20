/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import api from "../../utils/Request";
import useAuth from "../../hooks/useAuth";

const ModalComponent = ({ onClose, isOpen, groupId }) => {
  const admin = sessionStorage.getItem("admin");
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(false);

  // form data
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState(groupId);

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSendData = async () => {
    setLoading(true);
    try {
      const formData = new FormData(); // Create FormData object
      formData.append("title", title);
      formData.append("description", description);
      formData.append("group", group);
      formData.append("report", file); // Append the file to FormData

      const response = await api.post(
        "/api/report/create",
        formData, // Pass FormData instead of an object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important to set the content type
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        setResponseMessage("Report was created successfully"); // Set success message
      } else {
        setResponseMessage("An error occurred."); // Set error message
      }
    } catch (error) {
      console.error("Error creating report:", error);
      setResponseMessage("An error occurred."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  console.log(title, description, group, file);

  return (
    <Modal backdrop={"blur"} size="4xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <div className="font-semibold font-serif">
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-3xl">Create New Report</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2 text-2xl capitalize border-t-2 border-gray-200">
                <div className="flex flex-row justify-evenly mt-8">
                  <div className="w-full border-t-2 border-gray-200 flex flex-col gap-2 mt-4">
                    <label htmlFor="groupInput">Group ID</label>
                    <input
                      type="text"
                      id="groupInput"
                      className="outline-none rounded-lg py-2 px-1 bg-gray-200 text-black capitalize"
                      value={groupId}
                      disabled={true}
                      onChange={handleGroupChange}
                    />
                    <label htmlFor="titleInput">Title</label>
                    <input
                      type="text"
                      id="titleInput"
                      className="outline-none rounded-lg py-2 px-1 bg-gray-200 text-black capitalize"
                      value={title}
                      onChange={handleTitleChange}
                    />
                    <label htmlFor="descInput">Description</label>
                    <textarea
                      className="outline-none rounded-lg py-2 px-1 bg-gray-200 text-black"
                      id="descInput"
                      placeholder="Report description here"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                    <label htmlFor="fileInput">File</label>
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                    <div className="text-2xl mt-2">{responseMessage}</div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                isDisabled={!title || !description || !group || !file}
                onClick={handleSendData}
                isLoading={loading}
              >
                Create Report
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
