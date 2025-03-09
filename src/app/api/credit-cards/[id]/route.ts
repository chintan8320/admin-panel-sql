// app/api/credit-cards/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET a single credit card by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const creditCard = await prisma.creditCard.findUnique({
      where: { id },
    });
    
    if (!creditCard) {
      return NextResponse.json(
        { error: "Credit card not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(creditCard);
  } catch (error) {
    console.error("Failed to fetch credit card:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit card" },
      { status: 500 }
    );
  }
}

// PUT update a credit card
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();
    
    const updatedCreditCard = await prisma.creditCard.update({
      where: { id },
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
    
    return NextResponse.json(updatedCreditCard);
  } catch (error) {
    console.error("Failed to update credit card:", error);
    return NextResponse.json(
      { error: "Failed to update credit card" },
      { status: 500 }
    );
  }
}

// DELETE a credit card
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await prisma.creditCard.delete({
      where: { id },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete credit card:", error);
    return NextResponse.json(
      { error: "Failed to delete credit card" },
      { status: 500 }
    );
  }
}