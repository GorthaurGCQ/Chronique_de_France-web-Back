"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";

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

export default function AdminTotoPage() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    if (data.success) setEventList(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchEvents(); }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Page test (toto)</h1>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <p>{eventList.length} événement(s) chargé(s).</p>
      )}
    </div>
  );
}
