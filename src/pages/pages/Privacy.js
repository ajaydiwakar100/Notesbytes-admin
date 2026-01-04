import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";

/* ------------------ PAGE ------------------ */

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  /* ------------------ STATE ------------------ */

  const [privacyData, setPrivacyData] = useState({
    informationCollectTitle: "",
    informationCollectDescription: "",

    usageTitle: "",
    usageDescription: "",

    cookiesTitle: "",
    cookiesDescription: "",

    dataSecurityDescription: "",

    thirdPartyDescription: "",

    userRightsDescription: "",

    contactEmail: "",
    contactPhone: "",
  });

  const [privacySections, setPrivacySections] = useState([
    { title: "", description: "" },
  ]);

  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_ALL_SETTINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = res?.data?.data;
      if (!settings?.privacy_policy_content) return;

      const content =
        typeof settings.privacy_policy_content === "string"
          ? JSON.parse(settings.privacy_policy_content)
          : settings.privacy_policy_content;

      setPrivacyData({
        informationCollectTitle: content.informationCollectTitle ?? "",
        informationCollectDescription: content.informationCollectDescription ?? "",

        usageTitle: content.usageTitle ?? "",
        usageDescription: content.usageDescription ?? "",

        cookiesTitle: content.cookiesTitle ?? "",
        cookiesDescription: content.cookiesDescription ?? "",

        dataSecurityDescription: content.dataSecurityDescription ?? "",
        thirdPartyDescription: content.thirdPartyDescription ?? "",
        userRightsDescription: content.userRightsDescription ?? "",

        contactEmail: content.contactEmail ?? "",
        contactPhone: content.contactPhone ?? "",
      });

      setPrivacySections(
        Array.isArray(content.privacySections) && content.privacySections.length
          ? content.privacySections
          : [{ title: "", description: "" }]
      );
    } catch (err) {
      console.error("Failed to load Privacy Policy:", err);
    }
  };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrivacyData({ ...privacyData, [name]: value });
  };

  const handleArrayChange = (data, setter, index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setter(updated);
  };

  const addItem = (setter) =>
    setter((prev) => [...prev, { title: "", description: "" }]);

  const removeItem = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...privacyData,
      privacySections,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        SAVE_SETTING_API,
        { privacy_policy_content: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/pages/privacy-policy");
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
          <h1>Edit Privacy Policy</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit} style={{ margin: 20 }}>

            {/* DYNAMIC SECTIONS */}
            <Section title="Privacy Policy Sections">
              {privacySections.map((p, i) => (
                <Card key={i} title={`Section ${i + 1}`}>
                  <Input
                    label="Title"
                    value={p.title}
                    onChange={(e) =>
                      handleArrayChange(
                        privacySections,
                        setPrivacySections,
                        i,
                        "title",
                        e.target.value
                      )
                    }
                  />
                  <Textarea
                    label="Description"
                    value={p.description}
                    onChange={(e) =>
                      handleArrayChange(
                        privacySections,
                        setPrivacySections,
                        i,
                        "description",
                        e.target.value
                      )
                    }
                  />
                  {privacySections.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setPrivacySections, i)} />
                  )}
                </Card>
              ))}
              <AddBtn label="Add Section" onClick={() => addItem(setPrivacySections)} />
            </Section>

            <Section title="Information We Collect">
              <Input
                label="Title"
                name="informationCollectTitle"
                value={privacyData.informationCollectTitle}
                onChange={handleChange}
              />
              <Textarea
                label="Description"
                name="informationCollectDescription"
                value={privacyData.informationCollectDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="How We Use Information">
              <Input
                label="Title"
                name="usageTitle"
                value={privacyData.usageTitle}
                onChange={handleChange}
              />
              <Textarea
                label="Description"
                name="usageDescription"
                value={privacyData.usageDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="Cookies Policy">
              <Input
                label="Title"
                name="cookiesTitle"
                value={privacyData.cookiesTitle}
                onChange={handleChange}
              />
              <Textarea
                label="Description"
                name="cookiesDescription"
                value={privacyData.cookiesDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="Data Security">
              <Textarea
                label="Description"
                name="dataSecurityDescription"
                value={privacyData.dataSecurityDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="Third-Party Services">
              <Textarea
                label="Description"
                name="thirdPartyDescription"
                value={privacyData.thirdPartyDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="User Rights">
              <Textarea
                label="Description"
                name="userRightsDescription"
                value={privacyData.userRightsDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="Contact Information">
              <Input
                label="Contact Email"
                name="contactEmail"
                value={privacyData.contactEmail}
                onChange={handleChange}
              />
              <Input
                label="Contact Phone"
                name="contactPhone"
                value={privacyData.contactPhone}
                onChange={handleChange}
              />
            </Section>

            {/* ACTIONS */}
            <div className="row mt-4">
              <div className="col-lg-6 offset-lg-3">
                <button className="btn btn-primary">Update</button>
                &nbsp;
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/dashboard")}
                >
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
  <button
    type="button"
    className="btn btn-outline-primary btn-sm mb-3 ml-3"
    onClick={onClick}
  >
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

export default PrivacyPolicy;
