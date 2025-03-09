// app/api/credit-cards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all credit cards
export async function GET() {
  try {
    const creditCards = await prisma.creditCard.findMany();
    return NextResponse.json(creditCards);
  } catch (error) {
    console.error("Failed to fetch credit cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit cards" },
      { status: 500 }
    );
  }
}

// POST create a new credit card
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    const newCreditCard = await prisma.creditCard.create({
      data: {
        cardName: data.cardName,
        cardNumber: data.cardNumber,
        cardHolder: data.cardHolder,
        expiryDate: data.expiryDate,
        cardType: data.cardType,
        limit: data.limit,
        balance: data.balance,
      },
    });
    
    return NextResponse.json(newCreditCard, { status: 201 });
  } catch (error) {
    console.error("Failed to create credit card:", error);
    return NextResponse.json(
      { error: "Failed to create credit card" },
      { status: 500 }
    );
  }
}

