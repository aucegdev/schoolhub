import { useEffect, useState } from "react";
import { getSchoolInfo, updateSchoolInfo, uploadLogo, type School } from "../../services/school";

const emptySchool: School = {
  schoolName: "",
  tagline: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  website: "",
  affiliationNumber: "",
  board: "CBSE",
  establishedYear: new Date().getFullYear(),
};

const BOARDS = ["CBSE", "STATE", "ICSE"];

export default function SchoolInfo() {
  const [school, setSchool] = useState<School>(emptySchool);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSchoolInfo()
      .then((data) => {
        if (data) {
          setSchool(data);
          if (data.logo) {
            setLogoPreview(`http://localhost:4000/uploads/${data.logo}`);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSchool({ ...school, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateSchoolInfo(school);
      if (logoFile) {
        await uploadLogo(logoFile);
      }
      setMessage("School information saved successfully");
    } catch {
      setMessage("Failed to save school information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>School Information</h1>
      {message && <p className={message.includes("Failed") ? "error" : "success"}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>School Name</label>
          <input name="schoolName" value={school.schoolName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Tagline</label>
          <input name="tagline" value={school.tagline || ""} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Logo</label>
          {logoPreview && <img src={logoPreview} alt="Logo" width="100" />}
          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>
        <fieldset>
          <legend>Contact Information</legend>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={school.phone || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={school.email || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input name="website" value={school.website || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={school.address || ""} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" value={school.city || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input name="state" value={school.state || ""} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input name="pincode" value={school.pincode || ""} onChange={handleChange} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>School Details</legend>
          <div className="form-group">
            <label>Affiliation Number</label>
            <input name="affiliationNumber" value={school.affiliationNumber || ""} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Board</label>
            <select name="board" value={school.board || "CBSE"} onChange={handleChange}>
              {BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Established Year</label>
            <input name="establishedYear" type="number" value={school.establishedYear || ""} onChange={handleChange} />
          </div>
        </fieldset>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}
