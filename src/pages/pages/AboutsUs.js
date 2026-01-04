import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";

/* ------------------ PAGE ------------------ */

const AboutUs = () => {
  const navigate = useNavigate();

  /* ------------------ STATE ------------------ */

  const [aboutData, setAboutData] = useState({
    heroTitle: "",
    heroDescription: "",

    storyTitle: "",
    storyDescription: "",

    visionIcon: "",
    visionTitle: "",
    visionDescription: "",

    missionIcon: "",
    missionTitle: "",
    missionDescription: "",

    happyStudentsIcon: "",
    happyStudentsTitle: "",

    activeSellersIcon: "",
    activeSellersTitle: "",

    qualityNotesIcon: "",
    qualityNotesTitle: "",

    paidToSellersIcon: "",
    paidToSellersTitle: "",

    communityTitle: "",
    communityDescription: "",
  });

  const [values, setValues] = useState([
    { icon: "", title: "", description: "" },
  ]);

  const [journey, setJourney] = useState([
    { icon: "", title: "", description: "" },
  ]);

  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_ALL_SETTINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = res?.data?.data;
      if (!settings?.about_us_content) return;

      const aboutContent =
        typeof settings.about_us_content === "string"
          ? JSON.parse(settings.about_us_content)
          : settings.about_us_content;

      setAboutData({
        heroTitle: aboutContent.heroTitle ?? "",
        heroDescription: aboutContent.heroDescription ?? "",

        storyTitle: aboutContent.storyTitle ?? "",
        storyDescription: aboutContent.storyDescription ?? "",

        visionIcon: aboutContent.visionIcon ?? "",
        visionTitle: aboutContent.visionTitle ?? "",
        visionDescription: aboutContent.visionDescription ?? "",

        missionIcon: aboutContent.missionIcon ?? "",
        missionTitle: aboutContent.missionTitle ?? "",
        missionDescription: aboutContent.missionDescription ?? "",

        happyStudentsIcon: aboutContent.happyStudentsIcon ?? "",
        happyStudentsTitle: aboutContent.happyStudentsTitle ?? "",

        activeSellersIcon: aboutContent.activeSellersIcon ?? "",
        activeSellersTitle: aboutContent.activeSellersTitle ?? "",

        qualityNotesIcon: aboutContent.qualityNotesIcon ?? "",
        qualityNotesTitle: aboutContent.qualityNotesTitle ?? "",

        paidToSellersIcon: aboutContent.paidToSellersIcon ?? "",
        paidToSellersTitle: aboutContent.paidToSellersTitle ?? "",

        communityTitle: aboutContent.communityTitle ?? "",
        communityDescription: aboutContent.communityDescription ?? "",
      });

      setValues(
        Array.isArray(aboutContent.values) && aboutContent.values.length
          ? aboutContent.values
          : [{ icon: "", title: "", description: "" }]
      );

      setJourney(
        Array.isArray(aboutContent.journey) && aboutContent.journey.length
          ? aboutContent.journey
          : [{ icon: "", title: "", description: "" }]
      );
    } catch (err) {
      console.error("Failed to load About Us:", err);
    }
  };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAboutData({ ...aboutData, [name]: value });
  };

  const handleArrayChange = (data, setter, index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setter(updated);
  };

  const addItem = (setter) =>
    setter((prev) => [...prev, { icon: "", title: "", description: "" }]);

  const removeItem = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...aboutData,
      values,
      journey,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        SAVE_SETTING_API,
        { about_us_content: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/pages/about-us");
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
          <h1>Edit About Us</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit} style={{ margin: 20 }}>

            <Section title="Hero Section">
              <Input label="Title" name="heroTitle" value={aboutData.heroTitle} onChange={handleChange} />
              <Textarea label="Description" name="heroDescription" value={aboutData.heroDescription} onChange={handleChange} />
            </Section>

            <Section title="Our Story">
              <Input label="Title" name="storyTitle" value={aboutData.storyTitle} onChange={handleChange} />
              <Textarea label="Description" name="storyDescription" value={aboutData.storyDescription} onChange={handleChange} />
            </Section>

            <Section title="Our Vision">
              <Input label="Icon" name="visionIcon" value={aboutData.visionIcon} onChange={handleChange} />
              <Input label="Title" name="visionTitle" value={aboutData.visionTitle} onChange={handleChange} />
              <Textarea label="Description" name="visionDescription" value={aboutData.visionDescription} onChange={handleChange} />
            </Section>

            <Section title="Our Mission">
              <Input label="Icon" name="missionIcon" value={aboutData.missionIcon} onChange={handleChange} />
              <Input label="Title" name="missionTitle" value={aboutData.missionTitle} onChange={handleChange} />
              <Textarea label="Description" name="missionDescription" value={aboutData.missionDescription} onChange={handleChange} />
            </Section>

            <Section title="Our Journey">
              {journey.map((j, i) => (
                <Card key={i} title={`Journey ${i + 1}`}>
                  <Input label="Icon" value={j.icon} onChange={(e) => handleArrayChange(journey, setJourney, i, "icon", e.target.value)} />
                  <Input label="Title" value={j.title} onChange={(e) => handleArrayChange(journey, setJourney, i, "title", e.target.value)} />
                  <Textarea label="Description" value={j.description} onChange={(e) => handleArrayChange(journey, setJourney, i, "description", e.target.value)} />
                  {journey.length > 1 && <RemoveBtn onClick={() => removeItem(setJourney, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Journey" onClick={() => addItem(setJourney)} />
            </Section>

            <Section title="Our Values">
              {values.map((v, i) => (
                <Card key={i} title={`Value ${i + 1}`}>
                  <Input label="Icon" value={v.icon} onChange={(e) => handleArrayChange(values, setValues, i, "icon", e.target.value)} />
                  <Input label="Title" value={v.title} onChange={(e) => handleArrayChange(values, setValues, i, "title", e.target.value)} />
                  <Textarea label="Description" value={v.description} onChange={(e) => handleArrayChange(values, setValues, i, "description", e.target.value)} />
                  {values.length > 1 && <RemoveBtn onClick={() => removeItem(setValues, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Value" onClick={() => addItem(setValues)} />
            </Section>

            <Section title="Platform Statistics">
              <Input label="Happy Students Icon" name="happyStudentsIcon" value={aboutData.happyStudentsIcon} onChange={handleChange} />
              <Input label="Happy Students Title" name="happyStudentsTitle" value={aboutData.happyStudentsTitle} onChange={handleChange} />

              <Input label="Active Sellers Icon" name="activeSellersIcon" value={aboutData.activeSellersIcon} onChange={handleChange} />
              <Input label="Active Sellers Title" name="activeSellersTitle" value={aboutData.activeSellersTitle} onChange={handleChange} />

              <Input label="Quality Notes Icon" name="qualityNotesIcon" value={aboutData.qualityNotesIcon} onChange={handleChange} />
              <Input label="Quality Notes Title" name="qualityNotesTitle" value={aboutData.qualityNotesTitle} onChange={handleChange} />

              <Input label="Paid to Sellers Icon" name="paidToSellersIcon" value={aboutData.paidToSellersIcon} onChange={handleChange} />
              <Input label="Paid to Sellers Title" name="paidToSellersTitle" value={aboutData.paidToSellersTitle} onChange={handleChange} />
            </Section>

            <Section title="Join Our Growing Community">
              <Input label="Title" name="communityTitle" value={aboutData.communityTitle} onChange={handleChange} />
              <Textarea label="Description" name="communityDescription" value={aboutData.communityDescription} onChange={handleChange} />
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

export default AboutUs;
