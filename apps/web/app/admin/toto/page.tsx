"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "../admin.module.css";
import RichTextEditor from "@/components/RichTextEditor";

type Registration = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  createdAt: string;
};

type Event = {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  lieu: string;
  date: string;
  thumbnailUrl: string | null;
  region: string | null;
  timeline: string | null;
  domaine: string | null;
  publishedAt: string;
  authorName: string | null;
};



export default function AdminEvenements() {
 

  async function fetchEvents() {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    if (data.success) setEventList(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchEvents(); }, []);

  function startEdit(ev: Event) {
 
  }
}
