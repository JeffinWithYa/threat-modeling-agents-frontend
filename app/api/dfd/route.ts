import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";


export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { description  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!description) {
      return new NextResponse("No app description provided", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const appRunnerKey = process.env.APP_RUNNER_KEY;
    if (!appRunnerKey) {
      console.error('FASTAPI API key is not set in environment variables');
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // Send POST request to your external API
    const imageUrl = process.env.DFD_API_URL;
    if (!imageUrl) {
      // Handle the error, maybe throw an exception or return an error response
      throw new Error("DFD API URL is undefined. Please check your environment variables.");
    }

    const imageResponse = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': appRunnerKey
      },
      body: JSON.stringify({ description }),
    });

      // Check if the image was fetched successfully
    if (!imageResponse.ok) {
      throw new Error(`Error fetching task ID: ${imageResponse.statusText}`);
    }

    const taskResponse = await imageResponse.json();


    if (!isPro) {
      await incrementApiLimit();
    }
    
    return new NextResponse(JSON.stringify(taskResponse), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
