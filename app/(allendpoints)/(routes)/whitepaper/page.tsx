"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { tools } from "@/constants";

export default function WhitepaperPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-8">Privacy Policy</h1>
      
      <section className="bg-white p-6 rounded shadow">
        <p className="mb-4">
          WHITEPAPER PLACEHOLDER
        </p>

        <h2 className="text-xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Your privacy is critically important to us. This privacy policy outlines the types of personal information 
          received and collected by Killer Compliance Helper and how it is used.
        </p>

        <h2 className="text-xl font-semibold mb-4">Use of Third-Party Services</h2>
        <p className="mb-4">
          While we do not directly store any user data, we utilize several third-party services that may handle or process user data. These services are all GDPR compliant:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>
            Crisp
            <ul className="list-disc pl-5">
              <li><a href="https://crisp.chat/en/terms/" target="_blank" rel="noopener noreferrer">Terms of Use</a></li>
              <li><a href="https://crisp.chat/en/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://docs.crisp.chat/guides/others/security-practices/" target="_blank" rel="noopener noreferrer">Security</a></li>
            </ul>
          </li>
          <li>
            Clerk
            <ul className="list-disc pl-5">
              <li><a href="https://clerk.com/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a></li>
              <li><a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://clerk.com/docs/security/overview" target="_blank" rel="noopener noreferrer">Security</a></li>            
            </ul>
          </li>
          <li>
            Planetscale DB
            <ul className="list-disc pl-5">
              <li><a href="https://planetscale.com/legal/siteterms" target="_blank" rel="noopener noreferrer">Terms of Use</a></li>
              <li><a href="https://planetscale.com/legal/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            </ul>
          </li>
          <li>
            OpenAI API
            <ul className="list-disc pl-5">
              <li><a href="https://openai.com/security" target="_blank" rel="noopener noreferrer">Security information</a></li>
              <li><a href="https://openai.com/policies/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of use</a></li>
              <li><a href="https://platform.openai.com/subprocessors" target="_blank" rel="noopener noreferrer">Subprocessors</a></li>
              <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>

            </ul>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page.
        </p>

        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us using the widget in the bottom right corner.
        </p>
      </section>
    </div>
  </div>

  )};
