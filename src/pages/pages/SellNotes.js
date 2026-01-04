import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";

/* ------------------ PAGE ------------------ */

const SellNotes = () => {
  const navigate = useNavigate();

  /* ------------------ STATE ------------------ */

  const [sellData, setSellData] = useState({
    heroTitle: "",
    heroDescription: "",

    activeSellersIcon: "",
    activeSellersTitle: "",

    paidToSellersIcon: "",
    paidToSellersTitle: "",

    commissionRateIcon: "",
    commissionRateTitle: "",
  });

  const [sellingSteps, setSellingSteps] = useState([
    { icon: "", title: "", description: "" },
  ]);

  const [whySell, setWhySell] = useState([
    { icon: "", title: "", description: "" },
  ]);

  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchSellNotesPage();
  }, []);

  const fetchSellNotesPage = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_ALL_SETTINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = res?.data?.data;
      if (!settings?.sell_notes_content) return;

      const content =
        typeof settings.sell_notes_content === "string"
          ? JSON.parse(settings.sell_notes_content)
          : settings.sell_notes_content;

      setSellData({
        heroTitle: content.heroTitle ?? "",
        heroDescription: content.heroDescription ?? "",

        activeSellersIcon: content.activeSellersIcon ?? "",
        activeSellersTitle: content.activeSellersTitle ?? "",

        paidToSellersIcon: content.paidToSellersIcon ?? "",
        paidToSellersTitle: content.paidToSellersTitle ?? "",

        commissionRateIcon: content.commissionRateIcon ?? "",
        commissionRateTitle: content.commissionRateTitle ?? "",
      });

      setSellingSteps(
        Array.isArray(content.sellingSteps) && content.sellingSteps.length
          ? content.sellingSteps
          : [{ icon: "", title: "", description: "" }]
      );

      setWhySell(
        Array.isArray(content.whySell) && content.whySell.length
          ? content.whySell
          : [{ icon: "", title: "", description: "" }]
      );
    } catch (err) {
      console.error("Failed to load Sell Notes:", err);
    }
  };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellData({ ...sellData, [name]: value });
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
      ...sellData,
      sellingSteps,
      whySell,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        SAVE_SETTING_API,
        { sell_notes_content: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/pages/sell-notes");
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
          <h1>Edit Sell Notes Page</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit} style={{ margin: 20 }}>

            {/* HERO */}
            <Section title="Hero Section">
              <Input label="Title" name="heroTitle" value={sellData.heroTitle} onChange={handleChange} />
              <Textarea label="Description" name="heroDescription" value={sellData.heroDescription} onChange={handleChange} />
            </Section>

            {/* COUNTS */}
            <Section title="Platform Statistics">
              <Input label="Active Sellers Icon" name="activeSellersIcon" value={sellData.activeSellersIcon} onChange={handleChange} />
              <Input label="Active Sellers Title" name="activeSellersTitle" value={sellData.activeSellersTitle} onChange={handleChange} />

              <Input label="Paid to Sellers Icon" name="paidToSellersIcon" value={sellData.paidToSellersIcon} onChange={handleChange} />
              <Input label="Paid to Sellers Title" name="paidToSellersTitle" value={sellData.paidToSellersTitle} onChange={handleChange} />

              <Input label="Commission Rate Icon" name="commissionRateIcon" value={sellData.commissionRateIcon} onChange={handleChange} />
              <Input label="Commission Rate Title" name="commissionRateTitle" value={sellData.commissionRateTitle} onChange={handleChange} />
            </Section>

            {/* HOW SELLING WORKS */}
            <Section title="How Selling Works">
              {sellingSteps.map((s, i) => (
                <Card key={i} title={`Step ${i + 1}`}>
                  <Input label="Icon" value={s.icon} onChange={(e) => handleArrayChange(sellingSteps, setSellingSteps, i, "icon", e.target.value)} />
                  <Input label="Title" value={s.title} onChange={(e) => handleArrayChange(sellingSteps, setSellingSteps, i, "title", e.target.value)} />
                  <Textarea label="Description" value={s.description} onChange={(e) => handleArrayChange(sellingSteps, setSellingSteps, i, "description", e.target.value)} />
                  {sellingSteps.length > 1 && <RemoveBtn onClick={() => removeItem(setSellingSteps, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Step" onClick={() => addItem(setSellingSteps)} />
            </Section>

            {/* WHY SELL */}
            <Section title="Why Sell on NotesByte">
              {whySell.map((w, i) => (
                <Card key={i} title={`Reason ${i + 1}`}>
                  <Input label="Icon" value={w.icon} onChange={(e) => handleArrayChange(whySell, setWhySell, i, "icon", e.target.value)} />
                  <Input label="Title" value={w.title} onChange={(e) => handleArrayChange(whySell, setWhySell, i, "title", e.target.value)} />
                  <Textarea label="Description" value={w.description} onChange={(e) => handleArrayChange(whySell, setWhySell, i, "description", e.target.value)} />
                  {whySell.length > 1 && <RemoveBtn onClick={() => removeItem(setWhySell, i)} />}
                </Card>
              ))}
              <AddBtn label="Add Reason" onClick={() => addItem(setWhySell)} />
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

export default SellNotes;
