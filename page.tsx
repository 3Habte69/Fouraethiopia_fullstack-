"use client";
import { useEffect, useState } from "react";

type Question = { question: string; options: string[]; answerIndex: number };

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("past-exam");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([{ question: "", options: ["", "", "", ""], answerIndex: 0 }]);
  const [creating, setCreating] = useState(false);

  useEffect(() => { setToken(localStorage.getItem("token")); }, []);

  function addQuestion() {
    setQuestions(qs => [...qs, { question: "", options: ["", "", "", ""], answerIndex: 0 }]);
  }
  function updateQuestion(i:number, fn:(q:Question)=>Question) {
    setQuestions(qs => qs.map((q,idx)=>(idx===i? fn({...q}) : q)));
  }

  async function uploadPDF(): Promise<string | null> {
    if (!file) return null;
    const res = await fetch("/api/upload/create-url", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }) });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Failed upload URL"); return null; }
    const up = await fetch(data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/pdf" }, body: file });
    if (!up.ok) { alert("Upload failed"); return null; }
    return up.headers.get("Location");
  }

  async function createExam() {
    setCreating(true);
    try {
      const fileUrl = file ? await uploadPDF() : null;
      const payload = { title, subject, year, university, department, course, category, semester, fileUrl, questions };
      const res = await fetch("/api/exams", { method: "POST", headers: { "Content-Type": "application/json", ...(token? {Authorization: "Bearer "+token}: {}) }, body: JSON.stringify(payload) });
      const d = await res.json();
      if (!res.ok) alert(d.error || "Failed");
      else { alert("Exam created"); setTitle(""); setSubject(""); setUniversity(""); setDepartment(""); setCourse(""); setCategory("past-exam"); setSemester(""); setFile(null); setYear(new Date().getFullYear()); setQuestions([{ question: "", options: ["", "", "", ""], answerIndex: 0 }]); }
    } finally { setCreating(false); }
  }

  return (
    <div className="space-y-3">
      <div className="card space-y-2">
        <h1 className="text-2xl font-semibold">Admin — Create Exam</h1>
        <p className="text-sm text-gray-600">Admins are granted via <code>ADMIN_EMAILS</code> or Google Sign-In with a whitelisted email.</p>
        <div className="grid md:grid-cols-2 gap-2">
          <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
          <input className="input" type="number" placeholder="Year" value={year} onChange={e=>setYear(parseInt(e.target.value||"0"))} />
          <input className="input" placeholder="University" value={university} onChange={e=>setUniversity(e.target.value)} />
          <input className="input" placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} />
          <input className="input" placeholder="Course" value={course} onChange={e=>setCourse(e.target.value)} />
          <input className="input" placeholder="Semester" value={semester} onChange={e=>setSemester(e.target.value)} />
          <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="past-exam">Past Exam</option>
            <option value="quiz">Quiz</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
            <option value="other">Other</option>
          </select>
          <input className="input" type="file" accept="application/pdf" onChange={e=>setFile(e.target.files?.[0]||null)} />
        </div>
      </div>

      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>
          <button className="btn" onClick={addQuestion}>+ Add question</button>
        </div>
        {questions.map((q, qi) => (
          <div key={qi} className="border rounded p-3 space-y-2">
            <input className="input" placeholder={`Question ${qi+1}`} value={q.question} onChange={e=>updateQuestion(qi,qq=>({ ...qq, question: e.target.value }))} />
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input className="input" placeholder={`Option ${oi+1}`} value={opt} onChange={e=>updateQuestion(qi, qq=>{ const next=[...qq.options]; next[oi]=e.target.value; return { ...qq, options: next }; })} />
                <label className="text-sm flex items-center gap-1">
                  <input type="radio" name={`ans-${qi}`} checked={q.answerIndex===oi} onChange={()=>updateQuestion(qi, qq=>({ ...qq, answerIndex: oi }))} />
                  Correct
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="btn" disabled={creating} onClick={createExam}>{creating? "Creating..." : "Create Exam"}</button>
    </div>
  );
}
