import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";


export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { description } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!description) {
      return new NextResponse("App description is required", { status: 400 });
    }

    const hasFreeTrial = await checkApiLimit();
    const isSubscribedToPro = await checkSubscription();

    if (!hasFreeTrial && !isSubscribedToPro) {
      return new NextResponse("Exceeded max number of requests.", { status: 403 });
    }

    // Fetch request to FastAPI endpoint
    const appRunnerKey = process.env.APP_RUNNER_KEY;
    if (!appRunnerKey) {
      console.error('FASTAPI API key is not set in environment variables');
      return new NextResponse("Internal Server Error", { status: 500 });
    }
    const apiResponse = await fetch("http://127.0.0.1:4001/generate-roles-report-pdf", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': appRunnerKey
      },
      body: JSON.stringify({ description }) // Sending the required description
    });

    if (!apiResponse.ok) {
      throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    // Assuming the response is a PDF file
    const pdfData = await apiResponse.arrayBuffer();

    // Convert the blob to a URL for display
    // const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // log the URL to the console
    // console.log(pdfUrl);
    
    if (!isSubscribedToPro) {
      await incrementApiLimit();
    }

    // Preparing the response
    const response = new Response(pdfData, {
      headers: {
        'Content-Type': 'application/pdf'
      },
      status: 200
    });

    return response;




  } catch (error) {
    console.error('[API_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
