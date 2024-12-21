import { useState } from "react";

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
  disabled = false, // Add a disabled prop
}) {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (val) => {
    if (!disabled) {
      // Only update if not disabled
      setValue(val);
      updateFormValue({ updateType, value: val });
    }
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <input
        type={type || "text"}
        value={value}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input input-bordered w-full"
        disabled={disabled} // Disable the input when required
      />
    </div>
  );
}

export default InputText;
