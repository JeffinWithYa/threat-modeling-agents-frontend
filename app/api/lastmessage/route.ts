import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";


export async function POST(req: Request) {
  try {
    console.log('POST for LAST MESSAGE');
    const { userId } = auth();
    const body = await req.json();
    const { task_id } = body;


    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!task_id) {
      return new NextResponse("No task ID provided", { status: 400 });
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

    // Update the endpoint URL
    const lastMessageUrl = process.env.LAST_MESSAGE_API_URL;
    if (!lastMessageUrl) {
      throw new Error("Last Message API URL is undefined. Please check your environment variables.");
    }

    const lastMessageResponse = await fetch(`${lastMessageUrl}/${task_id}`, {
      method: 'GET',
      headers: {
        'x-api-key': appRunnerKey
      },
    });

    if (!lastMessageResponse.ok) {
      throw new Error(`Error fetching last message: ${lastMessageResponse.statusText}`);
    }

    const contentType = lastMessageResponse.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const lastMessageResult = await lastMessageResponse.json();
      console.log("LAST MESSAGE API RESULT: ", lastMessageResult);

      return new NextResponse(JSON.stringify(lastMessageResult), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error("Unexpected content type received from FastAPI endpoint.");
    }
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
