import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/config";

export default function Services() {
  return <main className="section container">
    <div className="eyebrow">Products & services</div>
    <h1 style={{fontSize:"clamp(42px,6vw,68px)"}}>Pick a starting point.</h1>
    <p className="lead">Each product is database-driven in production. The values shown here are development seed values and should be replaced with your own approved pricing.</p>
    <div className="grid grid-3" style={{marginTop:36}}>{services.map(s=><ServiceCard key={s.slug} service={s}/>)}</div>
  </main>;
}
