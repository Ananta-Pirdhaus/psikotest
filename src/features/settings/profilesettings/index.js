import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function ProfileSettings() {
  const dispatch = useDispatch();

  // State to hold profile data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    about: "", // Add any other fields if necessary
    language: "English", // Default values
    timezone: "IST", // Default timezone
    syncData: true, // Default syncData value
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user profile when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data.data;
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            about: "", // Adjust if you have an 'about' field in the response
            language: "English", // Default value for language
            timezone: "IST", // Default value for timezone
            syncData: true, // Default syncData value
          });
          setLoading(false);
        })
        .catch((error) => {
          setErrorMessage("Error fetching profile data");
          setLoading(false);
        });
    } else {
      setErrorMessage("No token found. Please login.");
      setLoading(false);
    }
  }, []);

  // Call API to update profile settings changes
  const updateProfile = () => {
    dispatch(showNotification({ message: "Profile Updated", status: 1 }));
    // Optionally, call an API to update the profile here
  };

  const updateFormValue = ({ updateType, value }) => {
    setProfile({ ...profile, [updateType]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <>
      <TitleCard title="Profile Settings" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputText
            labelTitle="Name"
            defaultValue={profile.name}
            updateType="name"
            updateFormValue={updateFormValue}
          />
          <InputText
            labelTitle="Email Id"
            defaultValue={profile.email}
            updateType="email"
            updateFormValue={updateFormValue}
          />
        </div>
        <div className="divider"></div>
        <div className="">
          <button
            className="btn btn-primary float-right"
            onClick={updateProfile}
          >
            Update
          </button>
        </div>
      </TitleCard>
    </>
  );
}

export default ProfileSettings;
