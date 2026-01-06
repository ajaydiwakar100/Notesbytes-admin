import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";

/* ------------------ PAGE ------------------ */

const TermsConditions = () => {
  const navigate = useNavigate();

  /* ------------------ STATE ------------------ */

  const [termsData, setTermsData] = useState({
    heroTitle: "",
    heroDescription: "",
    lastUpdated: "",

    introText: "",

    responsibilitiesTitle: "",
    responsibilitiesDescription: "",

    paymentTitle: "",
    paymentDescription: "",

    terminationTitle: "",
    terminationDescription: "",

    liabilityDescription: "",

    governingLawDescription: "",

    contactEmail: "",
    contactPhone: "",
  });

  const [termsList, setTermsList] = useState([
    { title: "", description: "" },
  ]);

  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_ALL_SETTINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = res?.data?.data;
      if (!settings?.terms_conditions_content) return;

      const content =
        typeof settings.terms_conditions_content === "string"
          ? JSON.parse(settings.terms_conditions_content)
          : settings.terms_conditions_content;

      setTermsData({
        heroTitle: content.heroTitle ?? "",
        heroDescription: content.heroDescription ?? "",
        lastUpdated: content.lastUpdated ?? "",

        introText: content.introText ?? "",

        responsibilitiesTitle: content.responsibilitiesTitle ?? "",
        responsibilitiesDescription: content.responsibilitiesDescription ?? "",

        paymentTitle: content.paymentTitle ?? "",
        paymentDescription: content.paymentDescription ?? "",

        terminationTitle: content.terminationTitle ?? "",
        terminationDescription: content.terminationDescription ?? "",

        liabilityDescription: content.liabilityDescription ?? "",
        governingLawDescription: content.governingLawDescription ?? "",

        contactEmail: content.contactEmail ?? "",
        contactPhone: content.contactPhone ?? "",
      });

      setTermsList(
        Array.isArray(content.termsList) && content.termsList.length
          ? content.termsList
          : [{ title: "", description: "" }]
      );
    } catch (err) {
      console.error("Failed to load Terms:", err);
    }
  };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTermsData({ ...termsData, [name]: value });
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
      ...termsData,
      termsList,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        SAVE_SETTING_API,
        { terms_conditions_content: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/pages/terms-conditions");
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
          <h1>Edit Terms & Conditions</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit} style={{ margin: 20 }}>

            {/* <Section title="Hero Section">
              <Input label="Title" name="heroTitle" value={termsData.heroTitle} onChange={handleChange} />
              <Textarea label="Description" name="heroDescription" value={termsData.heroDescription} onChange={handleChange} />
              <Input label="Last Updated Text" name="lastUpdated" value={termsData.lastUpdated} onChange={handleChange} />
            </Section> */}

            {/* <Section title="Introduction">
              <Textarea label="Intro Text" name="introText" value={termsData.introText} onChange={handleChange} />
            </Section> */}

            <Section title="Terms List">
              {termsList.map((t, i) => (
                <Card key={i} title={`Term ${i + 1}`}>
                  <Input
                    label="Title"
                    value={t.title}
                    onChange={(e) =>
                      handleArrayChange(termsList, setTermsList, i, "title", e.target.value)
                    }
                  />
                  <Textarea
                    label="Description"
                    value={t.description}
                    onChange={(e) =>
                      handleArrayChange(termsList, setTermsList, i, "description", e.target.value)
                    }
                  />
                  {termsList.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setTermsList, i)} />
                  )}
                </Card>
              ))}
              <AddBtn label="Add Term" onClick={() => addItem(setTermsList)} />
            </Section>

            <Section title="User Responsibilities">
              <Input label="Title" name="responsibilitiesTitle" value={termsData.responsibilitiesTitle} onChange={handleChange} />
              <Textarea label="Description" name="responsibilitiesDescription" value={termsData.responsibilitiesDescription} onChange={handleChange} />
            </Section>

            <Section title="Payment & Refund Policy">
              <Input label="Title" name="paymentTitle" value={termsData.paymentTitle} onChange={handleChange} />
              <Textarea label="Description" name="paymentDescription" value={termsData.paymentDescription} onChange={handleChange} />
            </Section>

            <Section title="Account Termination">
              <Input label="Title" name="terminationTitle" value={termsData.terminationTitle} onChange={handleChange} />
              <Textarea label="Description" name="terminationDescription" value={termsData.terminationDescription} onChange={handleChange} />
            </Section>

            <Section title="Limitation of Liability">
              <Textarea label="Description" name="liabilityDescription" value={termsData.liabilityDescription} onChange={handleChange} />
            </Section>

            <Section title="Governing Law">
              <Textarea label="Description" name="governingLawDescription" value={termsData.governingLawDescription} onChange={handleChange} />
            </Section>

            <Section title="Contact Information">
              <Input label="Contact Email" name="contactEmail" value={termsData.contactEmail} onChange={handleChange} />
              <Input label="Contact Phone" name="contactPhone" value={termsData.contactPhone} onChange={handleChange} />
            </Section>

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

export default TermsConditions;
