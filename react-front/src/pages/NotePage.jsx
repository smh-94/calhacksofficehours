import React, { useEffect, useState, useRef } from "react";
import ExamPage from "./ExamPage";
import Navbar from "../components/Navbar";
import FuncBar from "../components/FuncBar";
import Modal from "../components/Modal";
import { EditNote } from "../components/Menus";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Editor } from "@tinymce/tinymce-react";

export default function NotePage() {
  const [modalToggle, setModalToggle] = useState(false);
  const [examToggle, setExamToggle] = useState(false);
  const [initialValue, setInitialValue] = useState("");
  const [text, setText] = useState("");
  const authVariables = useAuth();
  const { id } = useParams();
  var textRef = doc(db, authVariables.currentUser.email, "notes", id, "text"); //reference to text doc
  var dateRef = doc(db, authVariables.currentUser.email, "notes", id, "date"); //reference to text doc

  const editorRef = useRef(null);

  async function getExamJSON() {
    var response;
    createTxt();
    //post txt
    // console.log("post request ran");
    // const url = "/rest/post";
    // const data = { filename: "agents/economics.txt" };
    // fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
    //return json
  }

  function createTxt() {
    //create txt with note data
    const textContent = text;
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

  async function getText() {
    var document = "";
    try {
      document = (await getDoc(textRef)).data().text;
    } catch (err) {
      console.error(err);
    }
    return document;
  }

  function updateText() {
    console.log("text updated starting");
    try {
      setDoc(textRef, { text: text });
      console.log("text updated successfully");
    } catch (err) {
      console.error(err);
      return;
    }
  }

  async function updateName(name) {}

  //retrieves text from firebase on first render
  useEffect(() => {
    getText().then((result) => {
      setText(result);
      setInitialValue(result);
    });
  }, []);

  //updates text in firebase when changed here
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (text) {
        updateText(text);
        //update date on doc
        try {
          setDoc(dateRef, { date: Date().substring(0, 15) });
        } catch (err) {
          console.error(err);
        }
      }
    }, 1000);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [text]);

  return (
    <>
      <Modal toggle={modalToggle}>
        <EditNote
          note={id}
          closeFunction={() => {
            setModalToggle(false);
          }}
          renameFunction={(name) => {
            updateName(name);
          }}
          deleteFunction={() => {}}
        />
      </Modal>
      <Navbar />
      <div className="w-full relative">
        <FuncBar
          editFunction={() => {
            setModalToggle(true);
          }}
          examFunction={() => {
            setExamToggle(true);
          }}
        />
        <Editor
          apiKey="rncicr4pa0ungw5lzix98tz61buq6rodfdnx37txoh1hi0se"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={initialValue}
          init={{
            height: "89vh",
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            resize: false,
          }}
          onEditorChange={() => {
            setText(editorRef.current.getContent());
          }}
        />
        {examToggle ? (
          <ExamPage
            name={id}
            toggle={() => {
              setExamToggle(!examToggle);
            }}
            className="z-40 bg-white"
            getData={() => {
              getExamJSON();
            }}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
