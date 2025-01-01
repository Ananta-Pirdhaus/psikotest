import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputText from "../../../../components/Input/InputText";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { addJurusan, getBakat } from "../jurusanSlice";
import Select from "react-select"; // Import react-select

const INITIAL_JURUSAN_OBJ = {
  name: "",
  bakat: [], // Array for selected "bakat"
};

function AddJurusansModalBody({ closeModal }) {
  const dispatch = useDispatch();

  // Get "bakatOptions" from Redux store
  const bakatOptions = useSelector((state) => state.jurusan.selectBakatOptions);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jurusanObj, setJurusanObj] = useState(INITIAL_JURUSAN_OBJ);

  // Fetch "bakat" options if not available in Redux store
  useEffect(() => {
    if (!bakatOptions || bakatOptions.length === 0) {
      dispatch(getBakat());
    }
  }, [bakatOptions, dispatch]);

  const saveNewJurusan = () => {
    // Log tracking nilai jurusanObj sebelum penyimpanan
    console.log("Jurusan Object before save:", jurusanObj);

    if (jurusanObj.name.trim() === "") {
      setErrorMessage("Name is required!");
      return;
    } else if (jurusanObj.bakat.length === 0) {
      setErrorMessage("At least one Bakat is required!");
      return;
    }

    // Membuat objek data JSON
    const payload = {
      name: jurusanObj.name,
      bakat: jurusanObj.bakat, // Ini adalah array bakat yang terpilih
    };

    // Log tracking nilai payload sebelum dikirimkan
    console.log("Payload before sending:", payload);

    setLoading(true);

    // Menggunakan axios atau fetch untuk mengirim data raw (JSON)
    dispatch(addJurusan(payload))
      .then((response) => {
        // Log hasil response dari action addJurusan
        console.log("Response from addJurusan:", response);

        dispatch(
          showNotification({ message: "New Jurusan Added!", status: 1 })
        );
        closeModal();
        setLoading(false);
      })
      .catch((error) => {
        // Log error jika ada
        console.error("Error while adding jurusan:", error);

        const errorDetails = error?.response?.data?.errors;
        if (errorDetails) {
          setErrorMessage(errorDetails.name?.[0] || errorDetails.bakat?.[0]);
        } else {
          setErrorMessage(error.message || "Failed to add new jurusan.");
        }
        setLoading(false);
      });
  };

  const updateFormValue = ({ updateType, value }) => {
    console.log(`Updating ${updateType} with value:`, value); // Log perubahan input
    setErrorMessage(""); // Reset error message

    // Update state dengan urutan pilihan yang dipilih
    setJurusanObj({
      ...jurusanObj,
      [updateType]: value, // menyimpan urutan pilihan yang dipilih
    });
  };

  // Only render the component when bakatOptions are available
  if (!bakatOptions || bakatOptions.length === 0) return <div>Loading...</div>;

  // Prepare options for react-select
  const bakatSelectOptions = bakatOptions.map((bakat) => ({
    value: bakat.value,
    label: bakat.label,
  }));

  // Menyaring nilai yang dipilih untuk mencocokkan urutan yang benar
  const selectedOptions = bakatSelectOptions.filter((option) =>
    jurusanObj.bakat.includes(option.value)
  );

  return (
    <>
      <InputText
        type="text"
        value={jurusanObj.name || ""} // Ensure it's always defined
        defaultValue={jurusanObj.name || ""} // Add defaultValue for initial value
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />

      {/* Dropdown for selecting bakat using react-select */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Bakat</label>
        <Select
          isMulti
          options={bakatSelectOptions}
          value={selectedOptions} // Menampilkan urutan pilihan yang benar
          onChange={(selectedOptions) =>
            updateFormValue({
              updateType: "bakat",
              value: selectedOptions
                ? selectedOptions.map((option) => option.value) // Urutan yang dipilih tetap terjaga
                : [], // Pastikan bakat selalu berupa array
            })
          }
          className="w-full"
          placeholder="Select Bakat"
        />
      </div>

      <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewJurusan}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddJurusansModalBody;
