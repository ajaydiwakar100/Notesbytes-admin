import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";

/* ------------------ PAGE ------------------ */

const GlobalSettings = () => {
  const navigate = useNavigate();

  /* ------------------ STATE ------------------ */
  const [settingsData, setSettingsData] = useState({
    appName: "",
    appLogo: "",
    footerText: "",
    email: "",
    phone: "",
    commission: "",
  });

  const [socialLinks, setSocialLinks] = useState([{ platform: "", url: "" }]);
  const [subjects, setSubjects] = useState([{ name: "" }]);
  const [exams, setExams] = useState([{ name: "" }]);
  const [notesLanguages, setNotesLanguages] = useState([{ name: "" }]);
  const [blogCategories, setBlogCategories] = useState([{ name: "" }]);


  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_ALL_SETTINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = res?.data?.data;
      if (!settings?.global_settings_content) return;

      const content =
        typeof settings.global_settings_content === "string"
          ? JSON.parse(settings.global_settings_content)
          : settings.global_settings_content;

      setSettingsData({
        appName: content.appName ?? "",
        appLogo: content.appLogo ?? "",
        footerText: content.footerText ?? "",
        email: content.email ?? "",
        phone: content.phone ?? "",
        refferalCommission: content.refferalCommission?? "",
        commission: content.commission?? "",
        minRefferalAmt: content.minRefferalAmt?? "",
        minCommisionAmt: content.minCommisionAmt?? "",
      });

      setSocialLinks(
        Array.isArray(content.socialLinks) && content.socialLinks.length
          ? content.socialLinks
          : [{ platform: "", url: "" }]
      );

      setSubjects(
        Array.isArray(content.subjects) && content.subjects.length
          ? content.subjects
          : [{ name: "" }]
      );

      setExams(
        Array.isArray(content.exams) && content.exams.length
          ? content.exams
          : [{ name: "" }]
      );

      setNotesLanguages(
        Array.isArray(content.notesLanguages) && content.notesLanguages.length
          ? content.notesLanguages
          : [{ name: "" }]
      );

      setBlogCategories(
        Array.isArray(content.blogCategories) && content.blogCategories.length
          ? content.blogCategories
          : [{ name: "" }]
      );
    } catch (err) {
      console.error("Failed to load Global Settings:", err);
    }
  };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData({ ...settingsData, [name]: value });
  };

  const handleArrayChange = (data, setter, index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setter(updated);
  };

  const addItem = (setter, defaultItem = { name: "" }) =>
    setter((prev) => [...prev, defaultItem]);

  const removeItem = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...settingsData,
      socialLinks,
      subjects,
      exams,
      notesLanguages,
      blogCategories
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        SAVE_SETTING_API,
        { global_settings_content: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/global-setting");
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Global Settings</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit} style={{ margin: 20 }}>

            {/* APP INFO */}
            <Section title="App Information">
              <Input label="App Name" name="appName" value={settingsData.appName} onChange={handleChange} />
              <Input label="App Logo URL" name="appLogo" value={settingsData.appLogo} onChange={handleChange} />
              <Textarea label="Footer Text" name="footerText" value={settingsData.footerText} onChange={handleChange} />
              <Input label="Commission (%)" name="commission" type="number" value={settingsData.commission} onChange={handleChange} />
              <Input label="Referal Commission (%)" name="refferalCommission" type="number" value={settingsData.refferalCommission} onChange={handleChange} />
              <Input label="Minimum Commission Amount (₹)" name="minCommisionAmt" type="number" value={settingsData.minCommisionAmt} onChange={handleChange} />
              <Input label="Minimum Referal Amount (₹)" name="minRefferalAmt" type="number" value={settingsData.minRefferalAmt} onChange={handleChange} />
              
            </Section>

            {/* CONTACT INFO */}
            <Section title="Contact Information">
              <Input label="Email" name="email" value={settingsData.email} onChange={handleChange} />
              <Input label="Phone Number" name="phone" value={settingsData.phone} onChange={handleChange} />
            </Section>

            {/* SOCIAL LINKS */}
            <Section title="Social Media Links">
              {socialLinks.map((s, i) => (
                <Card key={i} title={`Link ${i + 1}`}>
                  <Input label="Platform" value={s.platform} onChange={(e) => handleArrayChange(socialLinks, setSocialLinks, i, "platform", e.target.value)} />
                  <Input label="URL" value={s.url} onChange={(e) => handleArrayChange(socialLinks, setSocialLinks, i, "url", e.target.value)} />
                  {socialLinks.length > 1 && <RemoveBtn onClick={() => removeItem(setSocialLinks, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Social Link" onClick={() => addItem(setSocialLinks, { platform: "", url: "" })} />
            </Section>

            {/* SUBJECTS */}
            <Section title="Subjects">
              {subjects.map((s, i) => (
                <Card key={i} title={`Subject ${i + 1}`}>
                  <Input label="Name" value={s.name} onChange={(e) => handleArrayChange(subjects, setSubjects, i, "name", e.target.value)} />
                  {subjects.length > 1 && <RemoveBtn onClick={() => removeItem(setSubjects, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Subject" onClick={() => addItem(setSubjects)} />
            </Section>

            {/* EXAMS */}
            <Section title="Exams">
              {exams.map((e, i) => (
                <Card key={i} title={`Exam ${i + 1}`}>
                  <Input label="Name" value={e.name} onChange={(ev) => handleArrayChange(exams, setExams, i, "name", ev.target.value)} />
                  {exams.length > 1 && <RemoveBtn onClick={() => removeItem(setExams, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Exam" onClick={() => addItem(setExams)} />
            </Section>

            {/* NOTES LANGUAGES */}
            <Section title="Notes Languages">
              {notesLanguages.map((n, i) => (
                <Card key={i} title={`Language ${i + 1}`}>
                  <Input label="Name" value={n.name} onChange={(ev) => handleArrayChange(notesLanguages, setNotesLanguages, i, "name", ev.target.value)} />
                  {notesLanguages.length > 1 && <RemoveBtn onClick={() => removeItem(setNotesLanguages, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Language" onClick={() => addItem(setNotesLanguages)} />
            </Section>

            {/* BLOG CATEGORIES */}
            <Section title="Blog Categories">
              {blogCategories.map((b, i) => (
                <Card key={i} title={`Category ${i + 1}`}>
                  <Input
                    label="Name"
                    value={b.name}
                    onChange={(e) =>
                      handleArrayChange(blogCategories, setBlogCategories, i, "name", e.target.value)
                    }
                  />
                  {blogCategories.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setBlogCategories, i)} />
                  )}
                </Card>
              ))}
              <AddBtn
                label="Add Blog Category"
                onClick={() => addItem(setBlogCategories)}
              />
            </Section>

            {/* ACTIONS */}
            <div className="row mt-4">
              <div className="col-lg-6 offset-lg-3">
                <button className="btn btn-primary">Update</button>
                &nbsp;
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                  Cancel
                </button>
              </div>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};

/* ------------------ UI HELPERS ------------------ */

const Section = ({ title, children }) => (
  <>
    <h5 className="border-bottom pb-2 mb-3 mt-4">{title}</h5>
    {children}
  </>
);

const Card = ({ title, children }) => (
  <div className="border rounded p-3 mb-3 bg-light ml-3" style={{ marginRight: 20 }}>
    <strong>{title}</strong>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="row mb-3">
    <div className="col-lg-3">{label}</div>
    <div className="col-lg-6">
      <input className="form-control" {...props} />
    </div>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="row mb-3">
    <div className="col-lg-3">{label}</div>
    <div className="col-lg-6">
      <textarea className="form-control" rows={3} {...props} />
    </div>
  </div>
);

const AddBtn = ({ label, onClick }) => (
  <button type="button" className="btn btn-outline-primary btn-sm mb-3 ml-3" onClick={onClick}>
    + {label}
  </button>
);

const RemoveBtn = ({ onClick }) => (
  <div className="text-end">
    <button type="button" className="btn btn-danger btn-sm" onClick={onClick}>
      Remove
    </button>
  </div>
);

export default GlobalSettings;
