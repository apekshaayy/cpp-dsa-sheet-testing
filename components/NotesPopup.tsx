"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface NotesPopupProps {
  questionId: string;
}

export default function NotesPopup({ questionId }: NotesPopupProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`notes-${questionId}`);
    if (saved) setNotes(saved);
  }, [questionId]);

  const handleSave = () => {
    localStorage.setItem(`notes-${questionId}`, notes);
  };

  const applyFormat = (syntax: string) => {
    const textarea = document.getElementById(
      `notes-textarea-${questionId}`
    ) as HTMLTextAreaElement;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = notes.substring(start, end);

    const before = notes.substring(0, start);
    const after = notes.substring(end);

    let newText = "";
    if (syntax === "bold") {
      newText = `${before}**${selected || "bold text"}**${after}`;
    } else if (syntax === "italic") {
      newText = `${before}_${selected || "italic text"}_${after}`;
    } else if (syntax === "ul") {
      newText = `${before}- ${selected || "list item"}\n${after}`;
    } else if (syntax === "ol") {
      newText = `${before}1. ${selected || "list item"}\n${after}`;
    }

    setNotes(newText);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          📝 Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notes for Question</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex gap-2 mb-2">
          <Button size="sm" variant="outline" onClick={() => applyFormat("bold")}>
            B
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyFormat("italic")}>
            I
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyFormat("ul")}>
            • List
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyFormat("ol")}>
            1. List
          </Button>
        </div>

        {/* Notes Textarea */}
        <Textarea
          id={`notes-textarea-${questionId}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter notes..."
          rows={6}
          className="mt-2"
        />

        <div className="flex justify-end mt-4">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
