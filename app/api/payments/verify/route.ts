import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";

const schema = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  if (!process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: "Gateway not configured" }, { status: 503 });
  // In production, load the internal order from the database and compare its
  // stored gateway order id before accepting this signature.
  const payload = `${body.orderId}|${body.paymentId}`;
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(payload).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(body.signature))) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }
  return NextResponse.json({ verified: true });
}
