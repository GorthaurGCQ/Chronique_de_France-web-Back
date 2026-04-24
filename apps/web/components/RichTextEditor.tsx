"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEffect, useCallback } from "react";
import styles from "./RichTextEditor.module.css";

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// ── Bouton de barre d'outils ─────────────────────────────────────────────────

function ToolBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault(); // évite la perte de focus de l'éditeur
        onClick();
      }}
      className={`${styles.toolBtn} ${active ? styles.toolBtnActive : ""}`}
    >
      {children}
    </button>
  );
}

// ── Séparateur ───────────────────────────────────────────────────────────────

function Sep() {
  return <span className={styles.sep} aria-hidden="true" />;
}

// ── Composant principal ──────────────────────────────────────────────────────

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: styles.editorArea,
        "data-placeholder": placeholder ?? "Rédigez le contenu ici…",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  // Synchronise si la valeur change de l'extérieur (mode édition)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien :", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const colors = ["#1a1a1a", "#b8933a", "#1e3a5f", "#7b1f1f", "#2a6b2a", "#4a4a8a", "#888", "#fff"];

  return (
    <div className={styles.wrapper}>
      {/* ── Barre d'outils ── */}
      <div className={styles.toolbar} role="toolbar" aria-label="Mise en forme du texte">

        {/* Styles de paragraphe */}
        <select
          className={styles.headingSelect}
          value={
            editor.isActive("heading", { level: 1 }) ? "h1"
            : editor.isActive("heading", { level: 2 }) ? "h2"
            : editor.isActive("heading", { level: 3 }) ? "h3"
            : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: Number(v[1]) as 1|2|3 }).run();
          }}
          title="Style de paragraphe"
        >
          <option value="p">Paragraphe</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
        </select>

        <Sep />

        {/* Formatage de base */}
        <ToolBtn title="Gras (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>G</strong>
        </ToolBtn>
        <ToolBtn title="Italique (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="Souligné (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>S</u>
        </ToolBtn>
        <ToolBtn title="Barré" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <s>B</s>
        </ToolBtn>
        <ToolBtn title="Code inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          {"</>"}
        </ToolBtn>

        <Sep />

        {/* Alignement */}
        <ToolBtn title="Aligner à gauche" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>⬅</ToolBtn>
        <ToolBtn title="Centrer" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>↔</ToolBtn>
        <ToolBtn title="Aligner à droite" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>➡</ToolBtn>
        <ToolBtn title="Justifier" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>☰</ToolBtn>

        <Sep />

        {/* Listes */}
        <ToolBtn title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• —</ToolBtn>
        <ToolBtn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolBtn>
        <ToolBtn title="Citation" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;</ToolBtn>

        <Sep />

        {/* Lien */}
        <ToolBtn title="Insérer un lien" active={editor.isActive("link")} onClick={setLink}>🔗</ToolBtn>
        <ToolBtn title="Supprimer le lien" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}>🔗✕</ToolBtn>

        <Sep />

        {/* Couleurs */}
        <div className={styles.colorPicker} title="Couleur du texte">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Couleur ${c}`}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().setColor(c).run();
              }}
              className={`${styles.colorSwatch} ${editor.isActive("textStyle", { color: c }) ? styles.colorSwatchActive : ""}`}
              style={{ background: c, border: c === "#fff" ? "1px solid #ccc" : undefined }}
            />
          ))}
          <button
            type="button"
            title="Réinitialiser la couleur"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
            className={styles.colorReset}
          >↺</button>
        </div>

        <Sep />

        {/* Historique */}
        <ToolBtn title="Annuler (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↩</ToolBtn>
        <ToolBtn title="Rétablir (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↪</ToolBtn>
        <ToolBtn title="Effacer le formatage" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>✕ fmt</ToolBtn>
      </div>

      {/* ── Zone d'édition ── */}
      <EditorContent editor={editor} className={styles.editorWrap} />
    </div>
  );
}
