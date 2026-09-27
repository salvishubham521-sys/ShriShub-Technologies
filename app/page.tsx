import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { services, brand } from "@/lib/config";

export default function Home() {
  return <>
    <main>
      <section className="hero container">
        <div className="eyebrow">AI-assisted product delivery</div>
        <h1>From idea to a professional web product, without the uncertainty.</h1>
        <p className="lead">{brand.description} Choose a service, describe your requirements, review the scope and price, accept the agreement, pay securely, and track delivery from one place.</p>
        <div className="actions">
          <Link href="/services" className="btn btn-primary">Explore services</Link>
          <Link href="/order?service=custom" className="btn">I have an idea →</Link>
        </div>
        <div className="grid grid-3" style={{marginTop:60}}>
          <div className="card"><div className="kpi">01</div><p>Structured discovery</p></div>
          <div className="card"><div className="kpi">02</div><p>Clear scope + contract</p></div>
          <div className="card"><div className="kpi">03</div><p>Tracked delivery</p></div>
        </div>
      </section>

      <section className="section container">
        <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",marginBottom:24}}>
          <div><div className="eyebrow">Services</div><h2>Choose what you need.</h2></div>
          <Link href="/services" className="btn">View all</Link>
        </div>
        <div className="grid grid-3">{services.slice(0,6).map(s=><ServiceCard key={s.slug} service={s}/>)}</div>
      </section>

      <section id="how" className="section container">
        <div className="grid grid-2">
          <div><div className="eyebrow">How it works</div><h2>A simple customer journey.</h2><p className="lead">Every important business action is explicit: scope, price, agreement, payment, delivery and review.</p></div>
          <div className="card steps">
            {["Select a service or explain your idea","Complete the guided requirements form","Review the fixed quote and project scope","Accept the digital service agreement","Pay securely and access your project dashboard","Message, review progress, request revisions and approve delivery"].map(x=><div className="step" key={x}><div>{x}</div></div>)}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="card" style={{padding:40}}>
          <div className="eyebrow">Built for trust</div>
          <h2>One place for your project.</h2>
          <div className="grid grid-3" style={{marginTop:28}}>
            <div><h3>Transparent pricing</h3><p>Prices are stored in the database and can be changed by the administrator without editing code.</p></div>
            <div><h3>Secure workflow</h3><p>Customer access, project data and privileged operations are designed around server-side authorization and database policies.</p></div>
            <div><h3>AI with guardrails</h3><p>AI can analyze requirements and suggest structure, but configured prices, contracts and business decisions remain under admin control.</p></div>
          </div>
        </div>
      </section>
    </main>
  </>;
}
