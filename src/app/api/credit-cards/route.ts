import { NextRequest, NextResponse } from "next/server";
import { CardType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreditCardResponse = {
  id: string;
  cardName: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: CardType;
  limit: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    
    const createdBefore = url.searchParams.get('createdBefore');
    const createdAfter = url.searchParams.get('createdAfter');
    
    let where: { createdAt?: { lt?: Date; gt?: Date } } = {};
    
    if (createdBefore || createdAfter) {
      where.createdAt = {};
      
      if (createdBefore) {
        where.createdAt.lt = new Date(createdBefore); 
      }
      
      if (createdAfter) {
        where.createdAt.gt = new Date(createdAfter); 
      }
    }
    
    const creditCards = await prisma.creditCard.findMany({
      where,
      orderBy: {
        createdAt: 'desc' 
      }
    });
    
    return NextResponse.json(creditCards);
  } catch (error) {
    console.error("Failed to fetch credit cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit cards" },
      { status: 500 }
    );
  }
}
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

