import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import reload_icon from "../components/images/reload.png";

export default function ExamPage({ className, toggle, name, rawText }) {
  const [pairs, setPairs] = useState({ questions: [""], answers: [""] });

  useEffect(() => {
    createExamJSON();
    const fetchData = async () => {
      const data = await getExamJSON();
      setPairs(data);
    };
    fetchData();
  }, []);

  async function getExamJSON() {
    var response;
    //return json
    await fetch("http://localhost:3000/data")
      .then((res) => {
        return res.json();
      })
      .then((j) => {
        response = j;
      });
    return response;
  }

  async function createExamJSON() {
    console.log("burning deisel");
    createTxt();
    //post txt
    const url = "/rest/post";
    const data = { filename: "agents/raw_notes.txt" };
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function createTxt() {
    //create txt with note data
    const textContent = rawText;
    const blob = new Blob([textContent], { type: "text/plain" });
    const file = new File([blob], "raw_notes.txt", { type: "text/plain" });

    // Step 2: Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file); // 'file' is the key that the server will use to access the file

    // Step 3: Send the file to the server
    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div
      className={
        "w-full h-full flex flex-col absolute top-0 left-0 border-t-2 " +
        className
      }
    >
      <div className="w-full pt-5 px-10 text-2xl flex flex-row">
        <h1 className="grow"></h1>
        <button
          className="w-fit m-auto mr-5 p-2 bg-gray-400 text-white text-lg rounded-md"
          onClick={() => {}}
        >
          <img src={reload_icon.src} />
          <h1>Regenerate</h1>
        </button>
        <button
          onClick={() => {
            toggle();
          }}
        >
          X
        </button>
      </div>
      <div className="mx-auto text-4xl flex flex-row">
        <h1 className="mr-2 text-blue-600"> {name} </h1>
        {/* <h1>Exam </h1> */}
      </div>
      <main className="w-full grow flex flex-col">
        <div className="w-full flex flex-row">
          <button className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 hover:bg-cyan-400 duration-300 my-auto p-2 rounded-md bg-blue-500 text-white mx-auto drop-shadow-lg">
            Quizzes
          </button>
          <button className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 hover:bg-cyan-400 duration-300 my-auto p-2 rounded-md bg-blue-500 text-white mx-auto drop-shadow-lg">
            Flashcards
          </button>
          <button className="transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 hover:bg-cyan-400 duration-300 my-auto p-2 rounded-md bg-blue-500 text-white mx-auto drop-shadow-lg">
            Flashcards
          </button>
          s
        </div>
      </main>
    </div>
  );
}
