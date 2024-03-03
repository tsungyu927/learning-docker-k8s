"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const DOMAIN = process.env.API_DOMAIN;

const Fib = () => {
  const [values, setValues] = useState({});
  const [indexes, setIndexes] = useState([]);
  const [inputIndex, setInputIndex] = useState("");

  const fetchValues = async () => {
    const value = await axios.get("/api/values/current");
    setValues(value.data);
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get("/api/values/all");
    setIndexes(seenIndexes.data);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    await axios.post("/api/values", {
      index: inputIndex,
    });

    setInputIndex("");
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <form
        className="p-4 flex items-center gap-2 border border-dashed"
        onSubmit={handleSubmit}
      >
        <label>Enter your index:</label>
        <input
          className="rounded h-full px-1 text-black"
          value={inputIndex}
          onChange={(e) => setInputIndex(e.target.value)}
        />
        <button type="submit" className="p-1 border border-solid rounded">
          Submit
        </button>
      </form>

      <h3>Indexes I have seen:</h3>
      <p>{indexes.map(({ number }) => number).join(", ")}</p>

      <h3>Calculated Values:</h3>
      {Object.entries(values).map(([key, value]) => (
        <div key={key}>{`For index ${key} I calculated ${value}`}</div>
      ))}
    </div>
  );
};

export default Fib;
