import Link from "next/link";

export default function ServiceCard({ service }: { service: any }) {
  return <article className="card">
    <span className="badge">{service.delivery}</span>
    <h3 style={{fontSize:22,marginTop:16}}>{service.name}</h3>
    <p>{service.short}</p>
    <div className="price">₹{service.price.toLocaleString("en-IN")}</div>
    <ul className="muted">
      {service.features.map((f: string) => <li key={f} style={{marginBottom:7}}>{f}</li>)}
    </ul>
    <Link className="btn btn-primary" href={`/order?service=${service.slug}`}>Start this project</Link>
  </article>;
}
