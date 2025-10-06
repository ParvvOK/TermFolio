import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/context";

export const Form = () => {
  const { setPortfolioSubmitted } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    imageUrl: "",
    age: "",
    role: "",
    locationPreference: "",
    availability: "",
    description: "",
    phone: "",
    email: "",
    socialLinks: "",
    miscellaneous: "",
    hobbies: "",
    qualifications: "",
    projectName: "",
    projectRepo: "",
    projectApp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "https://termfolio-s914.onrender.com/data/portfolio",
        {
          ...formData,
          hobbies: formData.hobbies
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean),
          qualifications: formData.qualifications
            .split(",")
            .map((q) => q.trim())
            .filter(Boolean),
          socialLinks: formData.socialLinks
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          projects: [
            {
              name: formData.projectName,
              github: formData.projectRepo,
              applink: formData.projectApp,
            },
          ],
        },
        {
          headers: {
            token,
          },
        }
      );

      alert("Portfolio submitted successfully!");
      console.log("Success:", data);

      setPortfolioSubmitted(true);
    } catch (err) {
      console.error("Request failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to submit portfolio");
    }
  };

  const inputClass =
    "outline-none border-none bg-slate-900 text-slate-50 text-center shadow-lg " +
    "md:text-2xl text-xl px-4 py-2 w-full max-w-sm rounded-md focus:bg-slate-900";

  const textareaClass =
    "outline-none border-none bg-slate-900 text-slate-50 shadow-lg " +
    "md:text-2xl text-xl px-4 py-2 w-full max-w-sm rounded-md focus:bg-slate-900 " +
    "field-sizing-content";

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center mb-6">
        <button
          onClick={handleSubmit}
          className="bg-lime-500 hover:bg-lime-700 text-slate-900 font-use text-2xl px-6 py-2 rounded-md shadow-lg cursor-pointer"
        >
          Submit
        </button>
      </div>

      {/* desktop layout */}
      <div className="hidden lg:flex w-full items-center justify-center">
        <div className="w-4/5">
          <div className="grid grid-cols-10 gap-4 h-full w-full p-4 auto-rows-min">
            {/* about info */}
            <div className="col-span-6 bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
              <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
                About
              </div>
              <input
                className={inputClass}
                name="name"
                placeholder="Enter your name!"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="gender"
                placeholder="Enter your gender!"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="imageUrl"
                placeholder="Enter Image URL"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="age"
                placeholder="Enter your age!"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="role"
                placeholder="Enter your preferred role!"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="locationPreference"
                placeholder="Enter preferred location!"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="availability"
                placeholder="Available/Unavailable"
                onChange={handleChange}
              />
              <textarea
                className={textareaClass}
                name="description"
                placeholder="Describe yourself!"
                onChange={handleChange}
              />
            </div>

            {/* contact */}
            <div className="col-span-4 bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
              <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
                Contact
              </div>
              <input
                className={inputClass}
                name="phone"
                placeholder="Enter your number!"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="email"
                placeholder="Enter your email!"
                onChange={handleChange}
              />
              <textarea
                className={textareaClass}
                name="socialLinks"
                placeholder="Enter your socials (CSV)"
                onChange={handleChange}
              />
            </div>

            {/* misc */}
            <div className="col-span-7 bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
              <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
                Miscellaneous
              </div>
              <textarea
                className={textareaClass}
                name="miscellaneous"
                placeholder="Tell us more about yourself!"
                onChange={handleChange}
              />
              <textarea
                className={textareaClass}
                name="hobbies"
                placeholder="Enter your hobbies (CSV)"
                onChange={handleChange}
              />
              <textarea
                className={textareaClass}
                name="qualifications"
                placeholder="Enter your qualifications (CSV)"
                onChange={handleChange}
              />
            </div>

            {/* projects */}
            <div className="col-span-3 bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
              <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
                Projects
              </div>
              <input
                className={inputClass}
                name="projectName"
                placeholder="Project name"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="projectRepo"
                placeholder="GitHub repo link"
                onChange={handleChange}
              />
              <input
                className={inputClass}
                name="projectApp"
                placeholder="App link"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* mobile layout */}
      <div className="flex flex-col gap-4 p-4 lg:hidden w-full items-center">
        {/* about info */}
        <div className="bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
          <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
            About
          </div>
          <input
            className={inputClass}
            name="name"
            placeholder="Enter your name!"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="gender"
            placeholder="Enter your gender!"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="imageUrl"
            placeholder="Enter Image URL"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="age"
            placeholder="Enter your age!"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="role"
            placeholder="Enter your preferred role!"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="locationPreference"
            placeholder="Enter preferred location!"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="availability"
            placeholder="Available/Unavailable"
            onChange={handleChange}
          />
          <textarea
            className={textareaClass}
            name="description"
            placeholder="Describe yourself!"
            onChange={handleChange}
          />
        </div>

        {/* contact */}
        <div className="bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
          <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
            Contact
          </div>
          <input
            className={inputClass}
            name="phone"
            placeholder="Enter your number!"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="email"
            placeholder="Enter your e-mail!"
            onChange={handleChange}
          />
          <textarea
            className={textareaClass}
            name="socialLinks"
            placeholder="Enter your socials (CSV)"
            onChange={handleChange}
          />
        </div>

        {/* misc */}
        <div className="bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
          <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
            Miscellaneous
          </div>
          <textarea
            className={textareaClass}
            name="miscellaneous"
            placeholder="Tell us more about yourself!"
            onChange={handleChange}
          />
          <textarea
            className={textareaClass}
            name="hobbies"
            placeholder="Enter your hobbies (CSV)"
            onChange={handleChange}
          />
          <textarea
            className={textareaClass}
            name="qualifications"
            placeholder="Enter your qualifications (CSV)"
            onChange={handleChange}
          />
        </div>

        {/* projects */}
        <div className="bg-slate-800 rounded-md p-4 flex flex-col items-center justify-center gap-4">
          <div className="font-use sm:text-3xl text-2xl text-lime-500 font-bold">
            Projects
          </div>
          <input
            className={inputClass}
            name="projectName"
            placeholder="Project name"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="projectRepo"
            placeholder="GitHub repo link"
            onChange={handleChange}
          />
          <input
            className={inputClass}
            name="projectApp"
            placeholder="App link"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};
