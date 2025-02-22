import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function ProfileSettings() {
  const dispatch = useDispatch();

  // State to hold profile data
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
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
            id: userData.id || "", // Store user ID
            name: userData.name || "",
            email: userData.email || "",
            password: "", // Password field should be empty by default
          });
          setLoading(false);
        })
        .catch(() => {
          setErrorMessage("Error fetching profile data");
          setLoading(false);
        });
    } else {
      setErrorMessage("No token found. Please login.");
      setLoading(false);
    }
  }, []);

  // Call API to update profile settings
  const updateProfile = () => {
    if (!profile.id) {
      dispatch(showNotification({ message: "User ID not found", status: 0 }));
      return;
    }
    axios
      .put(`user/${profile.id}`, {
        name: profile.name,
        email: profile.email,
        password: profile.password,
      })
      .then(() => {
        dispatch(showNotification({ message: "Profile Updated", status: 1 }));
      })
      .catch(() => {
        dispatch(showNotification({ message: "Update Failed", status: 0 }));
      });
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
          <InputText
            labelTitle="Password"
            type="password"
            defaultValue=""
            updateType="password"
            updateFormValue={updateFormValue}
            placeholder={"Enter new password"}
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
