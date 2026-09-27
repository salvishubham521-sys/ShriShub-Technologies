import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";

const bodySchema = z.object({ orderId: z.string().uuid(), amount: z.number().int().positive(), currency: z.literal("INR") });

export async function POST(req: Request) {
  const body = bodySchema.parse(await req.json());
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 503 });
  }

  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const r = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: body.amount, currency: body.currency, receipt: body.orderId }),
    cache: "no-store",
  });
  if (!r.ok) return NextResponse.json({ error: "Unable to create payment order." }, { status: 502 });
  const gatewayOrder = await r.json();
  return NextResponse.json({ gatewayOrderId: gatewayOrder.id, keyId: process.env.RAZORPAY_KEY_ID });
}
