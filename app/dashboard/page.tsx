"use client";
import { useEffect, useState } from "react";
import { projectStatuses } from "@/lib/config";

export default function Dashboard() {
  const [quote,setQuote]=useState<any>(null);
  useEffect(()=>{const raw=sessionStorage.getItem("nexora_quote"); if(raw) setQuote(JSON.parse(raw));},[]);
  return <main className="section container">
    <div className="eyebrow">Customer portal</div><h1 style={{fontSize:"clamp(40px,6vw,64px)"}}>Your project workspace.</h1>
    {!quote ? <div className="notice">Demo mode: submit a project brief first. In production this page is protected by Supabase Auth and loads only the signed-in customer's records.</div> :
    <div className="grid grid-2" style={{marginTop:30}}>
      <section className="card"><span className="badge">Draft project</span><h2 style={{fontSize:32,marginTop:15}}>{quote.form.projectName}</h2><p>{quote.service.name}</p><div className="price">₹{quote.service.price.toLocaleString("en-IN")}</div><h3>AI discovery summary</h3><p>{quote.analysis?.summary || "Requirement analysis prepared."}</p><div className="actions"><button className="btn btn-primary">Create account & continue</button><button className="btn">View contract preview</button></div></section>
      <section className="card"><h3>Project timeline</h3><div className="timeline" style={{marginTop:18}}>{projectStatuses.map((s,i)=><div className="timeline-row" key={s}><span className={`dot ${i===0?"active":""}`}></span><span>{s}</span></div>)}</div></section>
      <section className="card"><h3>Messages</h3><p>Project-specific customer/admin conversation will appear here after authentication and project creation.</p><button className="btn">Open conversation</button></section>
      <section className="card"><h3>Contract & payment</h3><p>Production flow: admin-approved scope → contract snapshot → customer acceptance → server-created payment order → gateway confirmation → project activation.</p><button className="btn btn-primary">Continue to contract</button></section>
    </div>}
  </main>;
}
