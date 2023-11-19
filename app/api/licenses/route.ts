import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import axios from 'axios';

const {Octokit} = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_PAT
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function isValidGitHubUrl(url: string) {
  // The regex checks for the standard GitHub pattern.
  // It ensures there's a username and repository name after the base GitHub URL.
  const pattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/;
  return pattern.test(url);
}

function parseGitHubUrl(url: string) {
  const regex = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);

  if (match) {
    return {
      owner: match[1],
      repo: match[2]
    };
  } else {
    return null;
  }
}

async function getLicenseContent(owner: string, repo: string) {
  // Potential license filenames
  const licenseFileVariations = ['LICENSE', 'license.txt', 'LICENSE.txt', 'LICENSE.md', 'license', 'License.md', 'License', 'LICENCE'];

  for (const filename of licenseFileVariations) {
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: filename,
      });

      if (response.data && response.data.content) {
        // The content returned is in base64 format, so decode it
        const content = Buffer.from(response.data.content, 'base64').toString('utf8');
        return content;
      }
    } catch (error: any) {
      // Continue the loop if the file is not found
      if (error.status !== 404) {
        console.error(`Error fetching ${filename}:`, error);
      }
    }
  }

  return null;  // Return null if none of the variations match
}


export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // Gets last user message
    console.log("last user message: ")
    console.log(messages[messages.length - 1].content)
    const lastMessage = messages[messages.length - 1].content;
    // Checks if last message is a GitHub URL
    if (isValidGitHubUrl(lastMessage)) {
      // Fetch the contents of a LICENSE file from a GitHub repository
      //const git_response = await fetch(`${lastMessage}/raw/master/LICENSE`);
      //const license = await git_response.text();
      //console.log("license: ")
      //console.log(license)
      console.log("valid github url")
      const parsedUrl = parseGitHubUrl(lastMessage);
      if (parsedUrl) {
        const license = await getLicenseContent(parsedUrl.owner, parsedUrl.repo);
        console.log("license: ")
        console.log(license)
        if (license) {
          const final_message = "The license for " + lastMessage + " repository is: " + license;
          messages[messages.length - 1].content = final_message;
        } else {
          messages[messages.length - 1].content = "Could not find a license file in that repository.";
        }
      }





    }


    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages
    });

    if (!isPro) {
      await incrementApiLimit();
    }

    const final_response = NextResponse.json(response.data.choices[0].message);
    return final_response;
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
