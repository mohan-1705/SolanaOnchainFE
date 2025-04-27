import React, { useEffect, useContext, useState, useRef } from "react";


import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { GoogleGenerativeAI } from "@google/generative-ai";

import GraphOverlay from "../components/GraphOverlay";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css";
import { SunIcon } from "@radix-ui/react-icons";
import { Toaster, toast } from "sonner";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { GlobalContext } from "../context/GlobalContext";
import solana from "/cid/solana.png";


export function TradersPage() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const exampleAddress = "5zJaWSHpbnRPnY9QaxZAfbvpN9QM9FbnHKK7qTgpt7uy";

  const handleSearch = () => {
    if (search.length === 0) return;
    toast.success(`Searching for token: ${search}`);
    navigate(`/token/${search}/traders`);
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-br from-[#f2eafa] to-[#e0c3fc] flex flex-col items-center justify-center">
      <div className="w-[400px] border-2 border-[#b46efa] bg-white/90 border-dashed rounded-2xl p-8 flex flex-col justify-center items-center gap-5 shadow-xl">
        <img src={solana} alt="Solana" className="w-12 h-12 mb-2" />
        <h1 className="text-2xl font-bold mb-2 text-center text-[#7c3aed]">Start Investigation</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter Solana token address"
          className="w-full px-4 py-2 border-2 border-[#b46efa] rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#b46efa] shadow"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !search}
          className="bg-gradient-to-r from-[#a78bfa] to-[#f472b6] text-white px-4 py-2 rounded-lg w-full font-semibold shadow hover:scale-105 transition-transform"
        >
          {isLoading ? "Searching..." : "Start Investigation"}
        </button>
        <div className="w-full flex flex-col items-center mt-2">
          <span className="text-xs text-gray-500 mb-1">Example Solana SPL token address:</span>
          <div className="flex items-center gap-2 bg-[#f2eafa] px-3 py-1 rounded-lg text-xs text-[#7c3aed] font-mono">
            {exampleAddress}
            <button
              onClick={() => {
                navigator.clipboard.writeText(exampleAddress);
                toast.success("Copied to clipboard!");
              }}
              className="ml-2 text-[#b46efa] hover:text-[#7c3aed] transition-colors"
              title="Copy"
            >
              ⧉
            </button>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}
