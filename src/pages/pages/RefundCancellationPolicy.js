import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SAVE_SETTING_API, GET_ALL_SETTINGS_API } from "../../config";

/* ------------------ PAGE ------------------ */

const RefundCancellationPolicy = () => {
  const navigate = useNavigate();

  /* ------------------ STATE ------------------ */

  const [policyData, setPolicyData] = useState({
    processingTimeDescription: "",
    nonRefundableDescription: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [refundEligibility, setRefundEligibility] = useState([
    { title: "", description: "" },
  ]);

  const [cancellationPolicy, setCancellationPolicy] = useState([
    { title: "", description: "" },
  ]);

  const [refundProcess, setRefundProcess] = useState([
    { title: "", description: "" },
  ]);

  const [policySections, setPolicySections] = useState([
    { title: "", description: "" },
  ]);

  /* ------------------ LOAD DATA ------------------ */

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_ALL_SETTINGS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const settings = res?.data?.data;
      if (!settings?.refund_cancellation_policy_content) return;

      const content =
        typeof settings.refund_cancellation_policy_content === "string"
          ? JSON.parse(settings.refund_cancellation_policy_content)
          : settings.refund_cancellation_policy_content;

      setPolicyData({
        processingTimeDescription: content.processingTimeDescription ?? "",
        nonRefundableDescription: content.nonRefundableDescription ?? "",
        contactEmail: content.contactEmail ?? "",
        contactPhone: content.contactPhone ?? "",
      });

      setRefundEligibility(
        Array.isArray(content.refundEligibility) && content.refundEligibility.length
          ? content.refundEligibility
          : [{ title: "", description: "" }]
      );

      setCancellationPolicy(
        Array.isArray(content.cancellationPolicy) && content.cancellationPolicy.length
          ? content.cancellationPolicy
          : [{ title: "", description: "" }]
      );

      setRefundProcess(
        Array.isArray(content.refundProcess) && content.refundProcess.length
          ? content.refundProcess
          : [{ title: "", description: "" }]
      );

      setPolicySections(
        Array.isArray(content.policySections) && content.policySections.length
          ? content.policySections
          : [{ title: "", description: "" }]
      );
    } catch (err) {
      console.error("Failed to load Refund Policy:", err);
    }
  };

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicyData({ ...policyData, [name]: value });
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
      ...policyData,
      refundEligibility,
      cancellationPolicy,
      refundProcess,
      policySections,
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        SAVE_SETTING_API,
        { refund_cancellation_policy_content: JSON.stringify(payload) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.msg);
        navigate("/pages/refund");
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
          <h1>Edit Refund & Cancellation Policy</h1>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <form onSubmit={handleSubmit} style={{ margin: 20 }}>

            {/* REFUND ELIGIBILITY */}
            <Section title="Refund Eligibility">
              {refundEligibility.map((r, i) => (
                <Card key={i} title={`Eligibility ${i + 1}`}>
                  <Input
                    label="Title"
                    value={r.title}
                    onChange={(e) =>
                      handleArrayChange(refundEligibility, setRefundEligibility, i, "title", e.target.value)
                    }
                  />
                  <Textarea
                    label="Description"
                    value={r.description}
                    onChange={(e) =>
                      handleArrayChange(refundEligibility, setRefundEligibility, i, "description", e.target.value)
                    }
                  />
                  {refundEligibility.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setRefundEligibility, i)} />
                  )}
                </Card>
              ))}
              <AddBtn label="Add Eligibility" onClick={() => addItem(setRefundEligibility)} />
            </Section>

            {/* CANCELLATION POLICY */}
            <Section title="Cancellation Policy">
              {cancellationPolicy.map((c, i) => (
                <Card key={i} title={`Policy ${i + 1}`}>
                  <Input
                    label="Title"
                    value={c.title}
                    onChange={(e) =>
                      handleArrayChange(cancellationPolicy, setCancellationPolicy, i, "title", e.target.value)
                    }
                  />
                  <Textarea
                    label="Description"
                    value={c.description}
                    onChange={(e) =>
                      handleArrayChange(cancellationPolicy, setCancellationPolicy, i, "description", e.target.value)
                    }
                  />
                  {cancellationPolicy.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setCancellationPolicy, i)} />
                  )}
                </Card>
              ))}
              <AddBtn label="Add Policy" onClick={() => addItem(setCancellationPolicy)} />
            </Section>

            {/* REFUND PROCESS */}
            <Section title="Refund Process">
              {refundProcess.map((r, i) => (
                <Card key={i} title={`Step ${i + 1}`}>
                  <Input
                    label="Title"
                    value={r.title}
                    onChange={(e) =>
                      handleArrayChange(refundProcess, setRefundProcess, i, "title", e.target.value)
                    }
                  />
                  <Textarea
                    label="Description"
                    value={r.description}
                    onChange={(e) =>
                      handleArrayChange(refundProcess, setRefundProcess, i, "description", e.target.value)
                    }
                  />
                  {refundProcess.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setRefundProcess, i)} />
                  )}
                </Card>
              ))}
              <AddBtn label="Add Step" onClick={() => addItem(setRefundProcess)} />
            </Section>

            {/* OPTIONAL EXTRA SECTIONS */}
            <Section title="Additional Policy Sections">
              {policySections.map((p, i) => (
                <Card key={i} title={`Section ${i + 1}`}>
                  <Input
                    label="Title"
                    value={p.title}
                    onChange={(e) =>
                      handleArrayChange(policySections, setPolicySections, i, "title", e.target.value)
                    }
                  />
                  <Textarea
                    label="Description"
                    value={p.description}
                    onChange={(e) =>
                      handleArrayChange(policySections, setPolicySections, i, "description", e.target.value)
                    }
                  />
                  {policySections.length > 1 && (
                    <RemoveBtn onClick={() => removeItem(setPolicySections, i)} />
                  )}
                </Card>
              ))}
              <AddBtn label="Add Section" onClick={() => addItem(setPolicySections)} />
            </Section>

            {/* STATIC SECTIONS */}
            <Section title="Processing Time">
              <Textarea
                label="Description"
                name="processingTimeDescription"
                value={policyData.processingTimeDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="Non-Refundable Items">
              <Textarea
                label="Description"
                name="nonRefundableDescription"
                value={policyData.nonRefundableDescription}
                onChange={handleChange}
              />
            </Section>

            <Section title="Contact Information">
              <Input
                label="Contact Email"
                name="contactEmail"
                value={policyData.contactEmail}
                onChange={handleChange}
              />
              <Input
                label="Contact Phone"
                name="contactPhone"
                value={policyData.contactPhone}
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

export default RefundCancellationPolicy;
