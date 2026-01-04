import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";
import axios from "axios";
import { toast } from "react-toastify";

/* ------------------ PAGE ------------------ */

const Home = () => {
    const navigate = useNavigate();
    const [loadingRoles, setLoading] = useState(true);
  /* ------------------ STATE ------------------ */

  const [homeData, setHomeData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    featuredTitle: "",
    featuredSubtitle: "",
    testimonialTitle: "",
    stepsTitle: "How It Works",
    benefitsTitle: "Why Choose Us",
    status: true,
  });

  const [steps, setSteps] = useState([
    { icon: "", title: "", description: "" },
  ]);

  const [benefits, setBenefits] = useState([
    { icon: "", title: "", description: "" },
  ]);

  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchHomePage();
  }, []);

    const fetchHomePage = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(GET_ALL_SETTINGS_API,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            const settings = res?.data?.data;
            if (!settings?.home_page_content) return;

            // ✅ VERY IMPORTANT: Parse JSON string
            const homeContent =
            typeof settings.home_page_content === "string"
                ? JSON.parse(settings.home_page_content)
                : settings.home_page_content;

            // ---- BASIC DATA ----
            setHomeData({
            heroTitle: homeContent.heroTitle ?? "",
            heroSubtitle: homeContent.heroSubtitle ?? "",
            featuredTitle: homeContent.featuredTitle ?? "",
            featuredSubtitle: homeContent.featuredSubtitle ?? "",
            testimonialTitle: homeContent.testimonialTitle ?? "",
            stepsTitle: homeContent.stepsTitle ?? "How It Works",
            benefitsTitle: homeContent.benefitsTitle ?? "Why Choose Us",
            status: homeContent.status ?? true,
            });

            // ---- STEPS ----
            setSteps(
            Array.isArray(homeContent.steps) && homeContent.steps.length
                ? homeContent.steps.map((s) => ({
                    icon: s.icon ?? "",
                    title: s.title ?? "",
                    description: s.description ?? "",
                }))
                : [{ icon: "", title: "", description: "" }]
            );

            // ---- BENEFITS ----
            setBenefits(
            Array.isArray(homeContent.benefits) && homeContent.benefits.length
                ? homeContent.benefits.map((b) => ({
                    icon: b.icon ?? "",
                    title: b.title ?? "",
                    description: b.description ?? "",
                }))
                : [{ icon: "", title: "", description: "" }]
            );
        } catch (err) {
            console.error("Failed to load home page:", err);
        }
    };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHomeData({ ...homeData, [name]: type === "checkbox" ? checked : value });
  };

  const handleArrayChange = (setter, data, index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setter(updated);
  };

  const addItem = (setter, data) =>
    setter([...data, { icon: "", title: "", description: "" }]);

  const removeItem = (setter, data, index) =>
    setter(data.filter((_, i) => i !== index));

  /* ------------------ SUBMIT ------------------ */

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...homeData,
            steps,
            benefits,
        };

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(SAVE_SETTING_API,
                { home_page_content: JSON.stringify(payload),},
                { headers: { Authorization: `Bearer ${token}`,"Content-Type": "application/json",}}
            );

            if (res.data.status === "success") {
                toast.success(res.data.msg);
                navigate("/pages/home");
            } else {
                toast.error(res.data.msg);
            }  
        } catch (err) {
            console.error("Error:", err);
    
            if (err.response?.status === 403) {
                localStorage.clear();
                window.location.href = "/login";
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    };


  /* ------------------ UI ------------------ */

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <h1>Edit Home Page</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="box-main">
            <form onSubmit={handleSubmit} style={{ margin: 20 }}>

              {/* HERO */}
              <Section title="Hero Section">
                <Input
                  label="Hero Title"
                  name="heroTitle"
                  value={homeData.heroTitle}
                  onChange={handleChange}
                />
                <Textarea
                  label="Hero Subtitle"
                  name="heroSubtitle"
                  value={homeData.heroSubtitle}
                  onChange={handleChange}
                />
              </Section>

              {/* FEATURED */}
              <Section title="Featured Section">
                <Input
                  label="Featured Title"
                  name="featuredTitle"
                  value={homeData.featuredTitle}
                  onChange={handleChange}
                />
                <Textarea
                  label="Featured Subtitle"
                  name="featuredSubtitle"
                  value={homeData.featuredSubtitle}
                  onChange={handleChange}
                />
              </Section>

              {/* TESTIMONIAL */}
              <Section title="Testimonial Section">
                <Input
                  label="Testimonial Title"
                  name="testimonialTitle"
                  value={homeData.testimonialTitle}
                  onChange={handleChange}
                />
              </Section>

              {/* STEPS */}
              <Section title="Steps Section">
                <Input
                  label="Steps Section Title"
                  name="stepsTitle"
                  value={homeData.stepsTitle}
                  onChange={handleChange}
                />

                {steps.map((step, i) => (
                  <Card key={i} title={`Step ${i + 1}`}>
                    <Input
                      label="Icon"
                      placeholder="Search / fa-search / BookOpen"
                      value={step.icon}
                      onChange={(e) =>
                        handleArrayChange(setSteps, steps, i, "icon", e.target.value)
                      }
                    />
                    <Input
                      label="Step Title"
                      value={step.title}
                      onChange={(e) =>
                        handleArrayChange(setSteps, steps, i, "title", e.target.value)
                      }
                    />
                    <Textarea
                      label="Step Description"
                      value={step.description}
                      onChange={(e) =>
                        handleArrayChange(setSteps, steps, i, "description", e.target.value)
                      }
                    />
                    {steps.length > 1 && (
                      <RemoveBtn onClick={() => removeItem(setSteps, steps, i)} />
                    )}
                  </Card>
                ))}

                <AddBtn label="Add Step" onClick={() => addItem(setSteps, steps)} />
              </Section>

              {/* BENEFITS */}
              <Section title="Benefits Section">
                <Input
                  label="Benefits Section Title"
                  name="benefitsTitle"
                  value={homeData.benefitsTitle}
                  onChange={handleChange}
                />

                {benefits.map((b, i) => (
                  <Card key={i} title={`Benefit ${i + 1}`}>
                    <Input
                      label="Icon"
                      placeholder="Award / fa-award / TrendingUp"
                      value={b.icon}
                      onChange={(e) =>
                        handleArrayChange(setBenefits, benefits, i, "icon", e.target.value)
                      }
                    />
                    <Input
                      label="Benefit Title"
                      value={b.title}
                      onChange={(e) =>
                        handleArrayChange(setBenefits, benefits, i, "title", e.target.value)
                      }
                    />
                    <Textarea
                      label="Benefit Description"
                      value={b.description}
                      onChange={(e) =>
                        handleArrayChange(setBenefits, benefits, i, "description", e.target.value)
                      }
                    />
                    {benefits.length > 1 && (
                      <RemoveBtn onClick={() => removeItem(setBenefits, benefits, i)} />
                    )}
                  </Card>
                ))}

                <AddBtn label="Add Benefit" onClick={() => addItem(setBenefits, benefits)} />
              </Section>

              {/* ACTIONS */}
              <div className="row mt-4">
                <div className="col-lg-3"></div>
                <div className="col-lg-6">
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

export default Home;
