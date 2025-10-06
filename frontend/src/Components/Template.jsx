import React, { useState, useEffect } from "react";
import axios from "axios";
import { TermWindow } from "./TermWindow";
import { useAuth } from "../context/context";

export const Template = () => {
  const [selectedTab, setSelectedTab] = useState("about");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/data/portfolio", {
          headers: { token },
        });
        setPortfolio(res.data.portfolio);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchPortfolio();
  }, []);

  const handleRunCommand = (cmd) => {
    if (!cmd) return;
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    setHistory((prev) => [cmd, ...prev].slice(0, 10));
    if (["about", "projects", "contact", "misc"].includes(cmd)) {
      setSelectedTab(cmd);
    }
  };

  const handleExport = async () => {
    if (!portfolio) return alert("Portfolio not loaded yet!");
    try {
      const response = await axios.post(
        "http://localhost:3000/export/full",
        { portfolio },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${portfolio?.name || "termfolio"}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Check console for details.");
    }
  };

  const renderList = (arr) =>
    arr && arr.length > 0
      ? arr.map((item, i) => <li key={i}>{item}</li>)
      : null;

  const textColor = "text-slate-50";

  return (
    <div className="bg-slate-900 min-h-screen p-4 flex flex-col">
      {/* top buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="px-4 py-2 bg-slate-700 text-lime-400 font-semibold rounded-md hover:bg-slate-600 transition"
          onClick={handleExport}
        >
          Export
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* desktop bento layout */}
      <div className="hidden md:flex w-full justify-center items-center">
        <div className="w-full">
          <TermWindow>
            <div className="grid grid-cols-10 gap-4 w-full auto-rows-min p-4">
              <div className="col-span-6 bg-slate-700 rounded-md p-4 text-xl flex flex-col h-full">
                <div className="text-lime-500">
                  {portfolio?.name || "guest"}@termfolio:~$
                </div>
                <div className="flex items-center mb-2">
                  <span
                    className={`inline-block w-[0.9ch] h-6 bg-lime-500 mr-1 ${
                      cursorVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <input
                    className="bg-transparent text-slate-50 outline-none text-xl flex-1 caret-transparent"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const cmd = input.trim().toLowerCase();
                        handleRunCommand(cmd);
                        setInput("");
                      }
                    }}
                    placeholder="Enter command"
                    autoFocus
                  />
                </div>
                <div className="flex-1 bg-slate-800 p-2 rounded-md text-lime-500 text-sm overflow-auto">
                  <div className="border-b border-slate-700 pb-1 mb-2 font-bold">
                    Command History
                  </div>
                  {history.map((cmd, i) => (
                    <div key={i}>❯ {cmd}</div>
                  ))}
                </div>
              </div>

              {/* info card */}
              <div className="col-span-4 bg-slate-700 rounded-md p-4">
                <div className="flex p-4">
                  <div className="bg-slate-800 w-[90px] h-[130px] rounded-md shadow-lg overflow-hidden">
                    <img
                      src={portfolio?.imageUrl || ""}
                      alt="Profile"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                  <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold pl-4">
                    {portfolio?.name || ""}
                  </div>
                </div>
                <div className={`text-md ${textColor} px-4`}>
                  <p>{portfolio?.role}</p>
                  <p>{portfolio?.availability}</p>
                  <p>{portfolio?.locationPreference}</p>
                  <ul>{renderList(portfolio?.socialLinks)}</ul>
                </div>
              </div>

              {/* tabs */}
              {selectedTab === "about" && (
                <div className="col-span-7 bg-slate-700 rounded-md p-4 flex flex-col">
                  <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
                    About
                  </div>
                  <div className={`${textColor} text-md pl-2 mb-2`}>
                    <p>Name: {portfolio?.name}</p>
                    <p>Role: {portfolio?.role}</p>
                    <p>
                      Age/Gender: {portfolio?.age}/{portfolio?.gender}
                    </p>
                    <p>Location: {portfolio?.locationPreference}</p>
                    <p>Availability: {portfolio?.availability}</p>
                  </div>
                  <p
                    className={`${textColor} text-2xl font-use whitespace-pre-wrap mb-2`}
                  >
                    {portfolio?.description}
                  </p>
                  <ul className={`${textColor} list-disc pl-6`}>
                    {renderList(portfolio?.socialLinks)}
                  </ul>
                </div>
              )}

              {selectedTab === "projects" && (
                <div className="col-span-7 bg-slate-700 rounded-md p-4 flex flex-col">
                  <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
                    Projects
                  </div>
                  {portfolio?.projects?.map((proj, i) => (
                    <div key={i} className={`${textColor} text-xl mb-2`}>
                      <p>{proj.name}</p>
                      <p>{proj.github}</p>
                      <p>{proj.applink}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === "contact" && (
                <div className="col-span-7 bg-slate-700 rounded-md p-4 flex flex-col">
                  <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
                    Contact
                  </div>
                  <p className={`${textColor} text-xl`}>{portfolio?.email}</p>
                  <p className={`${textColor} text-xl`}>
                    Number : {portfolio?.phone}
                  </p>
                  <ul className={`${textColor} list-disc pl-6`}>
                    {renderList(portfolio?.socialLinks)}
                  </ul>
                </div>
              )}

              {selectedTab === "misc" && (
                <div className="col-span-7 bg-slate-700 rounded-md p-4 flex flex-col">
                  <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
                    Miscellaneous
                  </div>
                  {portfolio?.hobbies?.length > 0 && (
                    <>
                      <div className="text-xl text-lime-500 font-semibold mb-1">
                        Hobbies
                      </div>
                      <ul className="list-disc pl-6 text-slate-50">
                        {renderList(portfolio.hobbies)}
                      </ul>
                    </>
                  )}
                  {portfolio?.qualifications?.length > 0 && (
                    <>
                      <div className="text-xl text-lime-500 font-semibold mt-2 mb-1">
                        Qualifications
                      </div>
                      <ul className="list-disc pl-6 text-slate-50">
                        {renderList(portfolio.qualifications)}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {/* quickies */}
              <div className="col-span-3 bg-slate-700 rounded-md p-4 flex flex-col">
                <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
                  Quickies
                </div>
                <div>
                  {["about", "projects", "contact", "misc"].map((tab) => (
                    <p
                      key={tab}
                      className="text-white cursor-pointer"
                      onClick={() => handleRunCommand(tab)}
                    >
                      ❯ run command '{tab}'
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </TermWindow>
        </div>
      </div>

      {/* mobile layout */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* info */}
        <div className="bg-slate-700 rounded-md p-4">
          <div className="flex p-4">
            <div className="bg-slate-800 w-[90px] h-[130px] rounded-md shadow-lg overflow-hidden">
              <img
                src={portfolio?.imageUrl || ""}
                alt="Profile"
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold pl-4">
              {portfolio?.name || ""}
            </div>
          </div>
          <div className={`text-md ${textColor} px-4`}>
            <p>{portfolio?.role}</p>
            <p>{portfolio?.availability}</p>
            <p>{portfolio?.locationPreference}</p>
            <ul>{renderList(portfolio?.socialLinks)}</ul>
          </div>
        </div>

        {/* tabs */}
        {selectedTab === "about" && (
          <div className="bg-slate-700 rounded-md p-4 flex flex-col">
            <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
              About
            </div>
            <div className={`${textColor} text-md pl-2 mb-2`}>
              <p>Name: {portfolio?.name}</p>
              <p>Role: {portfolio?.role}</p>
              <p>
                Age/Gender: {portfolio?.age}/{portfolio?.gender}
              </p>
              <p>Location: {portfolio?.locationPreference}</p>
              <p>Availability: {portfolio?.availability}</p>
            </div>
            <p
              className={`${textColor} text-2xl font-use whitespace-pre-wrap mb-2`}
            >
              {portfolio?.description}
            </p>
            <ul className={`${textColor} list-disc pl-6`}>
              {renderList(portfolio?.socialLinks)}
            </ul>
          </div>
        )}

        {selectedTab === "projects" && (
          <div className="bg-slate-700 rounded-md p-4 flex flex-col">
            <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
              Projects
            </div>
            {portfolio?.projects?.map((proj, i) => (
              <div key={i} className={`${textColor} text-xl mb-2`}>
                <p>{proj.name}</p>
                <p>{proj.github}</p>
                <p>{proj.applink}</p>
              </div>
            ))}
          </div>
        )}

        {selectedTab === "contact" && (
          <div className="bg-slate-700 rounded-md p-4 flex flex-col">
            <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
              Contact
            </div>
            <p className={`${textColor} text-xl`}>{portfolio?.email}</p>
            <p className={`${textColor} text-xl`}>
              Number : {portfolio?.phone}
            </p>
            <ul className={`${textColor} list-disc pl-6`}>
              {renderList(portfolio?.socialLinks)}
            </ul>
          </div>
        )}

        {selectedTab === "misc" && (
          <div className="bg-slate-700 rounded-md p-4 flex flex-col">
            <div className="font-use sm:text-4xl text-3xl text-lime-500 font-bold mb-2">
              Miscellaneous
            </div>
            {portfolio?.hobbies?.length > 0 && (
              <>
                <div className="text-xl text-lime-500 font-semibold mb-1">
                  Hobbies
                </div>
                <ul className="list-disc pl-6 text-slate-50">
                  {renderList(portfolio.hobbies)}
                </ul>
              </>
            )}
            {portfolio?.qualifications?.length > 0 && (
              <>
                <div className="text-xl text-lime-500 font-semibold mt-2 mb-1">
                  Qualifications
                </div>
                <ul className="list-disc pl-6 text-slate-50">
                  {renderList(portfolio.qualifications)}
                </ul>
              </>
            )}
          </div>
        )}

        {/* quickies */}
        <div className="bg-slate-700 rounded-md p-4 flex flex-col">
          <div className="font-use sm:text-4xl text-3xl text-slate-50 font-bold mb-2">
            Quickies
          </div>
          <div>
            {["about", "projects", "contact", "misc"].map((tab) => (
              <p
                key={tab}
                className="text-white cursor-pointer"
                onClick={() => handleRunCommand(tab)}
              >
                ❯ run command '{tab}'
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
