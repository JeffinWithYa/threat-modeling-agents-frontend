"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { tools } from "@/constants";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8">Terms of Service</h1>
        
        <section className="bg-white p-6 rounded shadow">
          <p className="mb-4">
            Welcome to our website. If you continue to browse and use this website, you are agreeing 
            to comply with and be bound by the following terms and conditions of use.
          </p>

          <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-4">
            The content, whether generated by AI or human, provided on this site is for educational purposes only, 
            aiming to aid in understanding licenses and compliance. While we strive for accuracy and completeness,
            we do not warrant or guarantee that the information on this site is accurate, complete, or current.
          </p>
          <p className="mb-4">
            In no event shall we be liable for any direct, indirect, punitive, incidental, special or consequential 
            damages, or any damages whatsoever arising out of or connected with the use or misuse of this site or 
            its content. You acknowledge that advice, if any, provided on this website is general in nature and 
            does not constitute legal or professional advice. You should seek appropriate legal or professional advice 
            in relation to your own particular circumstances.
          </p>

          <h2 className="text-xl font-semibold mb-4">Payments and Subscriptions</h2>
          <p className="mb-4">
            Users may choose to support the platform by subscribing to a premium plan. Payments are processed through Stripe. 
            By choosing to pay or donate, you agree to Stripe's terms and conditions. Subscription fees are non-refundable, 
            except where required by law.
          </p>
          <p className="mb-4">
            Premium features or credits associated with paid subscriptions are only available to active subscribers. Should your 
            subscription lapse or be cancelled, access to these premium features may be restricted.
          </p>

          <h2 className="text-xl font-semibold mb-4">Data Protection</h2>
          <p className="mb-4">
            We respect and value the privacy of our users. All payment processing is secured and managed by Stripe, and 
            we do not store sensitive payment data on our servers. For more details on how user data is handled, 
            please refer to our Privacy Policy.
          </p>

          <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
          <p className="mb-4">
            Any claim or dispute relating to your use or attempted use of this website will be governed by and 
            construed in accordance with the laws of the applicable jurisdiction, without giving effect to its 
            conflict of laws provisions.
          </p>
        </section>
      </div>
    </div>

  )};
