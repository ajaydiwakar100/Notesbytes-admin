import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../layouts/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {GET_ALL_SETTINGS_API, SAVE_SETTING_API} from '../../config';

const GlobalSettings = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});

  // Fetch all settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(GET_ALL_SETTINGS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.status === "success") {
          // Transform array of settings into key-value object
          const settingsObj = {};
          data.data.forEach((item) => {
            settingsObj[item.key] = item.value;
          });
          setSettings(settingsObj);
        } else {
          toast.error(data.msg || "Failed to fetch settings");
        }
      } catch (err) {
        toast.error(err.response?.data?.msg || "Error fetching settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));

      for (const item of payload) {
        await axios.post(SAVE_SETTING_API, item, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0 text-dark">Global Settings</h1>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="box-main">
              <div className="box-main-table">
                <form onSubmit={handleSubmit}>
                  {Object.keys(settings).map((key) => (
                    <div className="row mb-3 align-items-center" key={key}>
                      <div className="col-lg-6 d-flex align-items-center">
                        <label
                          className="lableClass mb-0"
                          style={{ width: "180px" }}
                        >
                          {key
                            .split("_")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </label>
                        <input
                          type="text"
                          name={key}
                          className="form-control"
                          value={settings[key]}
                          onChange={handleChange}
                          style={{ marginLeft: "10px" }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="row">
                    <div
                      className="col-lg-6 d-flex"
                      style={{ marginLeft: "140px", gap: "10px" }}
                    >
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
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
          </div>
        </section>
      </div>
    </>
  );
};

export default GlobalSettings;
