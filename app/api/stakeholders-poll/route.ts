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
    const { task_id  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!task_id) {
      return new NextResponse("No task ID provided", { status: 400 });
    }
    //console.log('TASKID: ', task_id)

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
    const pollUrl = process.env.ROLES_POLL_URL;
    if (!pollUrl) {
      // Handle the error, maybe throw an exception or return an error response
      throw new Error("Roles Poll URL is undefined. Please check your environment variables.");
    }

    const pollResponse = await fetch(`${pollUrl}/${task_id}`, {
      method: 'GET',
      headers: {
        'x-api-key': appRunnerKey
      },
    });

      // Check if the pdf was fetched successfully
    if (!pollResponse.ok) {
      throw new Error(`Error polling task: ${pollResponse.statusText}`);
    }

    // Check the response content type
    const contentType = pollResponse.headers.get('Content-Type');


    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response
      const pollResult = await pollResponse.json();
      console.log(pollResult)
      if (pollResult.detail === "Task is still processing") {
        return new NextResponse(JSON.stringify(pollResult), { status: 202, headers: { 'Content-Type': 'application/json' } });
      } else {
        throw new Error(`Error polling task: ${pollResult.detail}`);
      }
    } else if (contentType && contentType.includes('application/pdf')) {
      // Handle image response
      const pdfBlob = await pollResponse.blob();

      if (!isPro) {
        await incrementApiLimit();
      }

      const headers = new Headers();
      headers.set('Content-Type', 'application/pdf'); 

      return new NextResponse(pdfBlob, { status: 200, headers });
    }

    
  } catch (error) {
      console.log('[CONVERSATION_ERROR]', error);
      return new NextResponse("Internal Error", { status: 500 });
    }
};
