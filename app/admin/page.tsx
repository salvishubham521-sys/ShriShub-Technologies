"use client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [stats,setStats]=useState({customers:128,active:17,completed:84,revenue:2845000});
  return <main className="section container">
    <div className="eyebrow">Operations console</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20}}><div><h1 style={{fontSize:"clamp(40px,6vw,64px)"}}>Admin control center.</h1><p className="lead">This dashboard is designed around admin ownership of pricing, scope, contracts, projects, content and AI knowledge.</p></div><button className="btn">Export report</button></div>
    <div className="grid grid-3" style={{marginTop:30}}>
      <div className="card"><div className="muted">Customers</div><div className="kpi">{stats.customers}</div></div>
      <div className="card"><div className="muted">Active projects</div><div className="kpi">{stats.active}</div></div>
      <div className="card"><div className="muted">Completed</div><div className="kpi">{stats.completed}</div></div>
    </div>
    <div className="grid grid-2" style={{marginTop:18}}>
      <section className="card"><h3>Pricing management</h3><p>Edit service price, discount, tax, revisions, delivery estimate, add-ons and availability without source-code changes.</p><table className="table"><tbody><tr><th>Service</th><th>Price</th><th>State</th></tr><tr><td>Portfolio</td><td>DB-configured</td><td>Active</td></tr><tr><td>Hotel</td><td>DB-configured</td><td>Active</td></tr><tr><td>Custom</td><td>Admin approval</td><td>Active</td></tr></tbody></table></section>
      <section className="card"><h3>Project operations</h3><p>Approve scope, issue contract, confirm payment, update milestones, upload deliverables, manage revisions and request reviews.</p><div className="actions"><button className="btn">Projects</button><button className="btn">Contracts</button><button className="btn">Payments</button><button className="btn">Messages</button></div></section>
    </div>
    <div className="card" style={{marginTop:18}}><h3>Security model</h3><p>In production, this route must be server-protected by role checks. Customer data is never trusted from the browser. Supabase RLS isolates customer-owned records; privileged operations run server-side with secrets.</p></div>
  </main>;
}
